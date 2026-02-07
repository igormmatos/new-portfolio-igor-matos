import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Layout from '../components/Layout';
import RichTextEditor from '../components/RichTextEditor';
import { api } from '../services/api';
import { authService } from '../services/auth';
import { hasInvalidSkillsSeparator, parseSkillsListInput } from '../services/richText';
import { Project, ProfileInfo, JourneyItem, Competency, TechnicalSkill } from '../types';
import { useI18n } from '../i18n';

type AdminTab = 'profile' | 'projects' | 'journey' | 'skills' | 'tech';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const SKILLS_SEPARATOR_ERROR = 'Use apenas ponto e vírgula (;) para separar os itens.';

// Interface para o estado do Modal de Exclusão
interface DeleteModalState {
  isOpen: boolean;
  id: string | null;
  itemName: string;
  typeLabel: string;
  deleteFn: ((id: string) => Promise<void>) | null;
  setListFn: React.Dispatch<React.SetStateAction<any[]>> | null;
}

// --- Componentes de UI Reutilizáveis ---
const FormInput = ({ label, value, onChange, placeholder, type = "text", min, max }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
    <input 
      type={type}
      min={min}
      max={max}
      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
      placeholder={placeholder}
      value={value || ''} 
      onChange={onChange} 
    />
  </div>
);

// --- Componente StrictModeDroppable ---
// Necessário para evitar problemas com React 18 Strict Mode e DnD
const StrictModeDroppable = ({ children, ...props }: any) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('profile');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [journey, setJourney] = useState<JourneyItem[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [techSkills, setTechSkills] = useState<TechnicalSkill[]>([]);
  const [isTechSkillsFallback, setIsTechSkillsFallback] = useState(false);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');

  // Editing States
  const [editingItem, setEditingItem] = useState<any>(null);
  const [skillsItemsInput, setSkillsItemsInput] = useState('');
  const [skillsItemsError, setSkillsItemsError] = useState<string | null>(null);
  
  // UI States
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    id: null,
    itemName: '',
    typeLabel: '',
    deleteFn: null,
    setListFn: null
  });

  const { t } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!isDrawerOpen || activeTab !== 'projects') return;
    const loadProjectSkills = async () => {
      if (editingItem?.id) {
        const ids = await api.getProjectSkillIds(editingItem.id);
        setSelectedSkillIds(ids);
      } else {
        setSelectedSkillIds([]);
      }
    };
    loadProjectSkills();
  }, [isDrawerOpen, activeTab, editingItem?.id]);

  const fetchAllData = async () => {
    const [pData, jData, cData, tData, profData] = await Promise.all([
      api.getProjects(),
      api.getJourney(),
      api.getCompetencies(),
      api.getTechnicalSkillsWithMeta(),
      api.getProfile()
    ]);
    
    // Sort items by display_order
    const sortFn = (a: any, b: any) => (a.display_order || 0) - (b.display_order || 0);
    
    setProjects(pData?.sort(sortFn) || []);
    setJourney(jData?.sort(sortFn) || []);
    setCompetencies(cData?.sort(sortFn) || []);
    setTechSkills(tData?.data?.sort(sortFn) || []);
    setIsTechSkillsFallback(!!tData?.fromFallback);
    setProfile(profData);
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      showNotification('Erro ao sair do sistema.', 'error');
    }
  };

  // --- Drag and Drop Handler ---
  
  // Feedback tátil ao pegar um item
  const handleDragStart = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    if (activeTab === 'tech' && isTechSkillsFallback) {
      showNotification('Não é possível reordenar tecnologias enquanto o fallback estiver ativo.', 'error');
      return;
    }

    // Função genérica para reordenar array
    const reorder = (list: any[], startIndex: number, endIndex: number) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      // Atualiza display_order baseado no novo índice e preserva os outros campos
      return result.map((item, index) => ({ ...item, display_order: index }));
    };

    let newItems: any[] = [];
    let tableName = '';

    // Lógica específica por aba
    if (activeTab === 'projects') {
        newItems = reorder(projects, sourceIndex, destinationIndex);
        setProjects(newItems);
        tableName = 'projects';
    } else if (activeTab === 'journey') {
        newItems = reorder(journey, sourceIndex, destinationIndex);
        setJourney(newItems);
        tableName = 'journey_items';
    } else if (activeTab === 'skills') {
        newItems = reorder(competencies, sourceIndex, destinationIndex);
        setCompetencies(newItems);
        tableName = 'competencies';
    } else if (activeTab === 'tech') {
        newItems = reorder(techSkills, sourceIndex, destinationIndex);
        setTechSkills(newItems);
        tableName = 'technical_skills';
    }

    // Persistir no backend (Batch Update)
    try {
        // CORREÇÃO: Enviamos o objeto completo (newItems) ao invés de apenas {id, order}
        // Isso garante que o UPSERT do Supabase tenha todos os campos obrigatórios (NOT NULL)
        // caso ele tente validar a inserção antes de identificar que é um update.
        await api.reorderItems(tableName, newItems);
        showNotification('Ordem atualizada com sucesso!', 'success');
        
    } catch (error) {
        console.error("Erro ao reordenar:", error);
        showNotification('Erro ao salvar a nova ordem.', 'error');
        // Reverte o estado visual em caso de erro
        fetchAllData();
    }
  };

  // --- Handlers do Drawer de Edição ---
  const syncSkillsInputState = (item: any) => {
    const raw = Array.isArray(item?.items)
      ? item.items.join('; ')
      : typeof item?.items === 'string'
        ? item.items
        : '';
    setSkillsItemsInput(raw);
    setSkillsItemsError(hasInvalidSkillsSeparator(raw) ? SKILLS_SEPARATOR_ERROR : null);
  };

  const handleOpenDrawer = (item: any = {}) => {
    setEditingItem(item);
    if (activeTab === 'skills') {
      syncSkillsInputState(item);
    } else {
      setSkillsItemsInput('');
      setSkillsItemsError(null);
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingItem(null);
    setSelectedSkillIds([]);
    setSkillSearch('');
    setSkillsItemsInput('');
    setSkillsItemsError(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      setIsSaving(true);
      try {
        await api.updateProfile(profile.id, profile);
        showNotification('Perfil atualizado com sucesso!', 'success');
        fetchAllData();
      } catch (err) {
        console.error(err);
        showNotification('Erro ao atualizar perfil', 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveItem = async () => {
    if (activeTab === 'tech' && isTechSkillsFallback) {
      showNotification('Não é possível editar tecnologias enquanto o fallback estiver ativo.', 'error');
      return;
    }

    let parsedSkillItems: string[] = [];
    if (activeTab === 'skills') {
      if (hasInvalidSkillsSeparator(skillsItemsInput)) {
        setSkillsItemsError(SKILLS_SEPARATOR_ERROR);
        showNotification(SKILLS_SEPARATOR_ERROR, 'error');
        return;
      }

      parsedSkillItems = parseSkillsListInput(skillsItemsInput);
      if (parsedSkillItems.length === 0) {
        showNotification('Adicione pelo menos um item de skill separado por ponto e vírgula (;).', 'error');
        return;
      }
      setSkillsItemsError(null);
    }

    setIsSaving(true);
    try {
      // Define display_order automaticamente para novos itens (final da lista)
      const getNextOrder = (listLength: number) => listLength;

      if (activeTab === 'projects') {
        const proj = editingItem as Project;
        const payload = {
          ...proj,
          slug: proj.slug || slugify(proj.title || ''),
          status: proj.status || 'published',
          display_order: proj.display_order ?? getNextOrder(projects.length)
        };
        let savedId = proj.id;
        if (proj.id) {
          const updated = await api.updateProject(proj.id, payload);
          savedId = updated?.[0]?.id || proj.id;
        } else {
          const created = await api.createProject(payload as any);
          savedId = created?.[0]?.id;
        }
        if (savedId) {
          await api.syncProjectSkills(savedId, selectedSkillIds);
        }

      } else if (activeTab === 'journey') {
        const jour = editingItem as JourneyItem;
        const payload = { ...jour, display_order: jour.display_order ?? getNextOrder(journey.length) };
        if (jour.id) await api.updateJourney(jour.id, payload);
        else await api.createJourney(payload as any);

      } else if (activeTab === 'skills') {
        const comp = editingItem as Competency;
        const payload = {
          ...comp,
          items: parsedSkillItems,
          display_order: comp.display_order ?? getNextOrder(competencies.length),
        };
        if (comp.id) await api.updateCompetency(comp.id, payload);
        else await api.createCompetency(payload as any);

      } else if (activeTab === 'tech') {
        const tech = editingItem as TechnicalSkill;
        const payload = {
          ...tech,
          slug: tech.slug || slugify(tech.name || ''),
          category: tech.category || 'other',
          icon_key: tech.icon_key || tech.icon,
          is_active: tech.is_active ?? true,
          display_order: tech.display_order ?? getNextOrder(techSkills.length)
        };
        if (tech.id) await api.updateTechnicalSkill(tech.id, payload);
        else await api.createTechnicalSkill(payload as any);
      }
      
      showNotification('Item salvo com sucesso!', 'success');
      fetchAllData();
      closeDrawer();
    } catch (error) {
      console.error("Error saving:", error);
      showNotification('Erro ao salvar item', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRequest = (
    id: string, 
    itemName: string,
    typeLabel: string,
    deleteFn: (id: string) => Promise<void>,
    setListFn: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    if (activeTab === 'tech' && isTechSkillsFallback) {
      showNotification('Não é possível excluir tecnologias enquanto o fallback estiver ativo.', 'error');
      return;
    }
    setDeleteModal({
      isOpen: true,
      id,
      itemName,
      typeLabel,
      deleteFn,
      setListFn
    });
  };

  const confirmDelete = async () => {
    const { id, deleteFn, setListFn } = deleteModal;
    if (!id || !deleteFn || !setListFn) return;
    try {
      setListFn((prev: any[]) => prev.filter(item => item.id !== id));
      setDeleteModal({ ...deleteModal, isOpen: false });
      await deleteFn(id);
      showNotification('Item removido com sucesso!', 'success');
    } catch (error) {
      console.error("Erro ao excluir:", error);
      showNotification('Ocorreu um erro ao excluir o item.', 'error');
      fetchAllData(); 
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal(prev => ({ ...prev, isOpen: false }));
  };

  const menuItems = [
    { id: 'profile', label: t('admin.profile'), icon: 'fa-solid fa-user' },
    { id: 'projects', label: t('admin.projects'), icon: 'fa-solid fa-layer-group' },
    { id: 'journey', label: t('admin.journey'), icon: 'fa-solid fa-road' },
    { id: 'skills', label: t('admin.skills'), icon: 'fa-solid fa-code' },
    { id: 'tech', label: t('admin.tech'), icon: 'fa-solid fa-microchip' },
  ];

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-80px)] bg-slate-900">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-950 hidden md:flex flex-col sticky top-20 h-[calc(100vh-80px)]">
          <div className="p-6 flex-1">
            <h2 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-6">{t('admin.dashboard')}</h2>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id 
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-900/20' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <i className={`${item.icon} w-5 text-center`}></i>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all group"
            >
              <i className="fa-solid fa-right-from-bracket group-hover:-translate-x-1 transition-transform"></i>
              <span className="font-medium">Sair do Sistema</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-50 capitalize">{menuItems.find(i => i.id === activeTab)?.label}</h1>
              <p className="text-slate-500 mt-1">{t('admin.manage')}</p>
            </div>
            {activeTab !== 'profile' && (
              <button 
                onClick={() => handleOpenDrawer({})}
                disabled={activeTab === 'tech' && isTechSkillsFallback}
                title={activeTab === 'tech' && isTechSkillsFallback ? 'Fallback ativo: edições desabilitadas' : undefined}
                className={`mt-4 md:mt-0 px-6 py-3 rounded-xl font-medium flex items-center shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                  activeTab === 'tech' && isTechSkillsFallback
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                }`}
              >
                <i className="fa-solid fa-plus mr-2"></i> {t('admin.add')}
              </button>
            )}

            <div className="md:hidden mt-4 w-full">
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as AdminTab)}
                    className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                      activeTab === item.id
                        ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30'
                        : 'text-slate-400 border-slate-800 bg-slate-950/50'
                    }`}
                  >
                    <i className={`${item.icon} mr-2`}></i>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="md:hidden mt-4 w-full">
               <button
                  onClick={handleLogout}
                  className="w-full py-2 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/10"
               >
                 Sair do Sistema
               </button>
            </div>
          </div>

          {/* Content Area */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-8 relative min-h-[500px]">
             
             {/* PROFILE TAB */}
             {activeTab === 'profile' && profile && (
               <form onSubmit={handleSaveProfile} className="max-w-4xl space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <FormInput label="Nome de Exibição" value={profile.display_name} onChange={(e: any) => setProfile({...profile, display_name: e.target.value})} />
                   <FormInput label="Headline (Cargo)" value={profile.headline} onChange={(e: any) => setProfile({...profile, headline: e.target.value})} />
                   
                   <div className="md:col-span-2">
                      <RichTextEditor
                        label="Biografia (Resumo)"
                        value={profile.bio}
                        onChange={(next) => setProfile({ ...profile, bio: next })}
                        placeholder="Escreva a biografia com formatação..."
                      />
                   </div>

                   <FormInput label="Texto do Badge (Status)" value={profile.badge} onChange={(e: any) => setProfile({...profile, badge: e.target.value})} placeholder="Ex: Disponível para projetos" />
                   <FormInput label="Frase de Impacto (Gradiente)" value={profile.action_phrase} onChange={(e: any) => setProfile({...profile, action_phrase: e.target.value})} placeholder="Ex: Futuro da Web" />
                   
                   <FormInput label="Email de Contato" value={profile.email_contact} onChange={(e: any) => setProfile({...profile, email_contact: e.target.value})} />
                   <FormInput label="WhatsApp (apenas números)" value={profile.whatsapp} onChange={(e: any) => setProfile({...profile, whatsapp: e.target.value})} placeholder="5511999999999" />
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:col-span-2">
                     <FormInput label="LinkedIn URL" value={profile.linkedin_url} onChange={(e: any) => setProfile({...profile, linkedin_url: e.target.value})} />
                     <FormInput label="GitHub URL" value={profile.git_url} onChange={(e: any) => setProfile({...profile, git_url: e.target.value})} placeholder="https://github.com/..." />
                   </div>
                 </div>
                 
                 <div className="pt-4 border-t border-slate-900 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all flex items-center gap-2"
                    >
                      {isSaving ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-check"></i>}
                      {t('admin.save')}
                    </button>
                 </div>
               </form>
             )}

             {/* DRAG AND DROP CONTEXT FOR LISTS */}
             {activeTab !== 'profile' && (
               <>
                {activeTab === 'tech' && isTechSkillsFallback && (
                  <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-200 text-sm flex items-center gap-2">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>Fallback ativo: tecnologias estão em modo somente leitura.</span>
                  </div>
                )}
                <div className="mb-4 text-xs text-slate-500 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                    <i className="fa-solid fa-hand-pointer text-[10px]"></i>
                  </span>
                  Arraste pelo ícone para reordenar os cards
                </div>
                <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                    <StrictModeDroppable droppableId={activeTab} direction={activeTab === 'journey' ? 'vertical' : 'horizontal'}>
                    {(provided: any, snapshot: any) => (
                        <div 
                            {...provided.droppableProps} 
                            ref={provided.innerRef}
                            className={`
                              grid ${activeTab === 'journey' ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'}
                              min-h-[200px] transition-all duration-300 rounded-2xl
                              ${snapshot.isDraggingOver ? 'bg-slate-900/40 ring-2 ring-dashed ring-indigo-500/20 p-4 -m-4' : 'p-2 -m-2'}
                            `}
                        >
                        
                        {/* PROJECTS CARDS */}
                        {activeTab === 'projects' && projects.map((p, index) => (
                            <Draggable key={p.id} draggableId={p.id} index={index}>
                            {(provided: any, snapshot: any) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`group bg-slate-900 border rounded-2xl overflow-hidden flex flex-col transition-all duration-200 relative select-none touch-manipulation
                                      ${snapshot.isDragging 
                                        ? 'border-indigo-400 ring-2 ring-indigo-500/30 shadow-2xl shadow-indigo-500/20 scale-105 rotate-2 z-50 bg-slate-800/95 opacity-90 backdrop-blur-sm cursor-grabbing' 
                                        : 'border-slate-800 hover:border-indigo-500/50'
                                      }`}
                                    style={{ ...provided.draggableProps.style }}
                                >
                                    {/* Drag Handle */}
                                    <div
                                      {...provided.dragHandleProps}
                                      role="button"
                                      aria-label="Arraste para reordenar"
                                      title="Arraste para reordenar"
                                      className={`absolute top-2 right-2 z-20 w-10 h-10 rounded-lg ${snapshot.isDragging ? 'bg-indigo-600 text-white cursor-grabbing' : 'bg-slate-950/80 text-slate-400 hover:text-white cursor-grab active:cursor-grabbing'} flex items-center justify-center backdrop-blur-sm border border-slate-800 transition-colors`}
                                    >
                                        <i className="fa-solid fa-grip-vertical"></i>
                                    </div>

                                    {/* Badge Ordem */}
                                    <span className="absolute top-2 left-2 z-10 bg-slate-950/80 backdrop-blur text-xs font-bold text-slate-400 border border-slate-800 px-2 py-1 rounded">
                                        #{index + 1}
                                    </span>

                                    <div className="h-40 w-full overflow-hidden relative">
                                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                                        {p.image_url ? (
                                        <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                                        ) : (
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
                                            <i className="fa-regular fa-image text-3xl"></i>
                                        </div>
                                        )}
                                    </div>
                                    
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-white mb-1">{p.title}</h3>
                                        <p className="text-xs text-indigo-400 font-medium uppercase tracking-wide mb-3">{p.role}</p>
                                        
                                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-800">
                                        <div className="flex gap-3">
                                            {p.live_url && <i className="fa-solid fa-globe text-slate-500 hover:text-white" title="Live"></i>}
                                            {p.github_url && <i className="fa-brands fa-github text-slate-500 hover:text-white" title="Code"></i>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenDrawer(p)} className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white flex items-center justify-center transition-all">
                                                <i className="fa-solid fa-pen text-xs"></i>
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteRequest(p.id, p.title, 'Projeto', api.deleteProject, setProjects)}
                                                className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                                            >
                                                <i className="fa-solid fa-trash text-xs"></i>
                                            </button>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Draggable>
                        ))}

                        {/* JOURNEY CARDS */}
                        {activeTab === 'journey' && journey.map((j, index) => (
                            <Draggable key={j.id} draggableId={j.id} index={index}>
                             {(provided: any, snapshot: any) => (
                                <div 
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`relative bg-slate-900 border rounded-2xl p-6 transition-all duration-200 group flex flex-col 
                                      ${snapshot.isDragging 
                                        ? 'border-indigo-400 bg-slate-800/95 opacity-90 backdrop-blur-sm shadow-xl scale-[1.02] z-50 cursor-grabbing' 
                                        : 'border-slate-800 hover:border-slate-600'
                                      }`}
                                    style={{ ...provided.draggableProps.style }}
                                >
                                    {/* Drag Handle */}
                                    <div {...provided.dragHandleProps} className={`absolute top-4 right-4 z-20 ${snapshot.isDragging ? 'text-indigo-400 cursor-grabbing' : 'text-slate-600 hover:text-white cursor-grab active:cursor-grabbing'}`}>
                                        <i className="fa-solid fa-grip-vertical text-xl"></i>
                                    </div>

                                    {/* Tipo Indicator */}
                                    <div className={`absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl ${j.type === 'experience' ? 'bg-indigo-500' : 'bg-green-500'}`}></div>
                                    
                                    <div className="flex justify-between items-start mb-4 pl-3 pr-8">
                                        <span className={`text-xs font-bold px-2 py-1 rounded border ${j.type === 'experience' ? 'bg-indigo-900/20 text-indigo-400 border-indigo-500/20' : 'bg-green-900/20 text-green-400 border-green-500/20'}`}>
                                            {j.type === 'experience' ? 'EXPERIÊNCIA' : 'EDUCAÇÃO'}
                                        </span>
                                    </div>

                                    <div className="pl-3 mb-4 flex-1">
                                        <h3 className="text-lg font-bold text-white mb-1 leading-snug">{j.title}</h3>
                                        <p className="text-slate-400 text-sm font-medium mb-2">{j.company}</p>
                                        <p className="text-slate-500 text-xs flex items-center gap-2">
                                            <i className="fa-regular fa-calendar"></i> {j.period}
                                        </p>
                                    </div>

                                    <div className="pl-3 flex justify-end gap-2 mt-auto pt-4 border-t border-slate-800/50">
                                        <button onClick={() => handleOpenDrawer(j)} className="text-xs font-semibold text-slate-300 border border-slate-700 hover:text-white hover:border-indigo-500 hover:bg-slate-800/60 flex items-center gap-2 px-3 py-2 rounded-lg transition-all">
                                            Editar
                                        </button>
                                        <button onClick={() => handleDeleteRequest(j.id, j.title, 'Jornada', api.deleteJourney, setJourney)} className="text-xs font-semibold text-red-400 border border-red-500/30 hover:text-white hover:bg-red-500/20 flex items-center gap-2 px-3 py-2 rounded-lg transition-all">
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                             )}
                            </Draggable>
                        ))}

                        {/* SKILLS CARDS */}
                        {activeTab === 'skills' && competencies.map((c, index) => (
                            <Draggable key={c.id} draggableId={c.id} index={index}>
                            {(provided: any, snapshot: any) => (
                                <div 
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`bg-slate-900 border rounded-2xl p-6 transition-all duration-200 relative group 
                                      ${snapshot.isDragging 
                                        ? 'border-indigo-400 ring-2 ring-indigo-500/30 shadow-2xl shadow-indigo-500/20 scale-105 rotate-1 z-50 bg-slate-800/95 opacity-90 backdrop-blur-sm cursor-grabbing' 
                                        : 'border-slate-800 hover:-translate-y-1'
                                      }`}
                                    style={{ ...provided.draggableProps.style }}
                                >
                                    <div
                                      {...provided.dragHandleProps}
                                      role="button"
                                      aria-label="Arraste para reordenar"
                                      title="Arraste para reordenar"
                                      className={`absolute top-2 right-2 w-10 h-10 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center ${snapshot.isDragging ? 'text-indigo-400 cursor-grabbing' : 'text-slate-400 hover:text-white cursor-grab active:cursor-grabbing'}`}
                                    >
                                        <i className="fa-solid fa-grip-vertical"></i>
                                    </div>

                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 text-xl group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                                            <i className={c.icon}></i>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{c.title}</h3>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 mb-6 min-h-[60px] content-start">
                                        {Array.isArray(c.items) && c.items.slice(0, 4).map((item, idx) => (
                                            <span key={idx} className="px-2 py-1 text-[10px] font-semibold bg-slate-950 text-slate-400 rounded border border-slate-800">
                                                {item}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpenDrawer(c)} className="flex-1 py-2 rounded-lg text-xs font-semibold text-slate-300 border border-slate-700 hover:text-white hover:border-indigo-500 hover:bg-slate-800/60 transition-all">
                                            Editar
                                        </button>
                                        <button onClick={() => handleDeleteRequest(c.id, c.title, 'Habilidade', api.deleteCompetency, setCompetencies)} className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-500/30 text-red-400 hover:text-white hover:bg-red-500/20 transition-all">
                                            <i className="fa-solid fa-trash text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            )}
                            </Draggable>
                        ))}

                        {/* TECH SKILLS CARDS */}
                        {activeTab === 'tech' && techSkills.map((t, index) => (
                            <Draggable key={t.id} draggableId={t.id} index={index}>
                            {(provided: any, snapshot: any) => (
                                <div 
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`bg-slate-900 border rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-200 relative group select-none touch-manipulation
                                      ${snapshot.isDragging 
                                        ? 'border-indigo-400 ring-2 ring-indigo-500/30 shadow-2xl shadow-indigo-500/20 scale-105 rotate-2 z-50 bg-slate-800/95 opacity-90 backdrop-blur-sm cursor-grabbing' 
                                        : 'border-slate-800 hover:border-indigo-500/50'
                                      }`}
                                    style={{ ...provided.draggableProps.style }}
                                >
                                    <div
                                      {...provided.dragHandleProps}
                                      role="button"
                                      aria-label="Arraste para reordenar"
                                      title="Arraste para reordenar"
                                      className={`absolute top-2 right-2 w-10 h-10 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center ${snapshot.isDragging ? 'text-indigo-400 cursor-grabbing' : 'text-slate-400 hover:text-white cursor-grab active:cursor-grabbing'}`}
                                    >
                                        <i className="fa-solid fa-grip-vertical"></i>
                                    </div>
                                    <span className="absolute top-2 left-2 text-[10px] font-bold text-slate-600 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                        #{index + 1}
                                    </span>

                                    <div className="w-12 h-12 mb-3 flex items-center justify-center text-2xl text-slate-300">
                                        <i className={t.icon_key || t.icon}></i>
                                    </div>
                                    <h3 className="text-white font-bold mb-1">{t.name}</h3>
                                    <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 mb-3">
                                      {t.category || 'other'}
                                    </p>
                                    <span className={`text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full border ${t.is_active ? 'border-emerald-500/40 text-emerald-300' : 'border-slate-700 text-slate-500'}`}>
                                      {t.is_active ? 'ativo' : 'inativo'}
                                    </span>

                                    <div className="flex gap-2 w-full mt-auto">
                                        <button
                                          onClick={() => handleOpenDrawer(t)}
                                          disabled={isTechSkillsFallback}
                                          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                                            isTechSkillsFallback
                                              ? 'border border-slate-800 text-slate-600 cursor-not-allowed'
                                              : 'border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500 hover:bg-slate-800/60'
                                          }`}
                                        >
                                            EDITAR
                                        </button>
                                        <button
                                          onClick={() => handleDeleteRequest(t.id, t.name, 'Tecnologia', api.deleteTechnicalSkill, setTechSkills)}
                                          disabled={isTechSkillsFallback}
                                          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                                            isTechSkillsFallback
                                              ? 'border border-slate-800 text-slate-600 cursor-not-allowed'
                                              : 'border border-red-500/30 text-red-400 hover:text-white hover:bg-red-500/20'
                                          }`}
                                        >
                                            <i className="fa-solid fa-trash text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            )}
                            </Draggable>
                        ))}
                        
                        {provided.placeholder}
                        </div>
                    )}
                    </StrictModeDroppable>
                </DragDropContext>
               </>
             )}

             {/* Empty State */}
            {((activeTab === 'projects' && projects.length === 0) || 
            (activeTab === 'journey' && journey.length === 0) ||
            (activeTab === 'skills' && competencies.length === 0) ||
            (activeTab === 'tech' && techSkills.length === 0)) && (
            <div className="col-span-full text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-4 text-slate-600">
                <i className="fa-regular fa-folder-open text-2xl"></i>
                </div>
                <p className="text-slate-500 font-medium">Nenhum item encontrado.</p>
                <button onClick={() => handleOpenDrawer({})} className="mt-4 text-indigo-400 hover:text-indigo-300 font-medium text-sm">
                Criar o primeiro item
                </button>
            </div>
            )}

          </div>
        </div>
      </div>

      {/* --- NOTIFICATIONS (Toast) --- */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-[70] px-6 py-4 rounded-xl shadow-2xl text-white font-bold flex items-center gap-3 animate-in slide-in-from-bottom-5 ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
            <i className={`fa-solid ${notification.type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation'}`}></i>
            {notification.message}
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={closeDeleteModal} />
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-[float_0.3s_ease-out]">
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <i className="fa-solid fa-triangle-exclamation text-2xl text-red-500"></i>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Excluir {deleteModal.typeLabel}?</h3>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                Você está prestes a remover <span className="font-semibold text-white">"{deleteModal.itemName}"</span>. Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={closeDeleteModal}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-900/20 transition-all hover:scale-[1.02]"
                >
                  Sim, Excluir
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Styled Drawer (Edição) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300" 
            onClick={closeDrawer}
          ></div>
          
          {/* Drawer Panel */}
          <div className="relative w-full max-w-lg bg-slate-900 h-full shadow-2xl border-l border-slate-800 flex flex-col animate-slide-in-right">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-10">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingItem?.id ? t('admin.edit') : t('admin.create')}
                </h3>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
                  {activeTab === 'projects' ? 'Detalhes do Projeto' : 
                   activeTab === 'journey' ? 'Item de Jornada' : 
                   activeTab === 'skills' ? 'Competência Técnica' : 'Tecnologia'}
                </p>
              </div>
              <button onClick={closeDrawer} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-all">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
              
              {/* NOTA: Removemos o campo de display_order, pois agora é controlado pelo Drag and Drop */}

              {activeTab === 'projects' && (
                <>
                  <FormInput
                    label="Título do Projeto"
                    value={editingItem.title}
                    onChange={(e: any) => {
                      const title = e.target.value;
                      const shouldSyncSlug =
                        !editingItem.slug || editingItem.slug === slugify(editingItem.title || '');
                      setEditingItem({
                        ...editingItem,
                        title,
                        slug: shouldSyncSlug ? slugify(title) : editingItem.slug,
                      });
                    }}
                    placeholder="Ex: E-commerce Platform"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormInput label="Papel / Role" value={editingItem.role} onChange={(e: any) => setEditingItem({...editingItem, role: e.target.value})} placeholder="Ex: Lead Developer" />
                     <FormInput label="Slug" value={editingItem.slug} onChange={(e: any) => setEditingItem({...editingItem, slug: slugify(e.target.value)})} placeholder="ex: plataforma-financeira" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Status</label>
                    <select
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
                      value={editingItem.status || 'published'}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    >
                      <option value="published">Publicado</option>
                      <option value="draft">Rascunho</option>
                    </select>
                  </div>

                  <RichTextEditor
                    label="Descrição"
                    value={editingItem.description}
                    onChange={(next) => setEditingItem({ ...editingItem, description: next })}
                    placeholder="Descreva o projeto com formatação..."
                  />
                  
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tecnologias utilizadas</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="Buscar tecnologia..."
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                    />
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                      {techSkills
                        .filter((skill) => (skill.is_active ?? true))
                        .filter((skill) => {
                          const name = (skill.name || '').toLowerCase();
                          return name.includes(skillSearch.toLowerCase());
                        })
                        .map((skill) => {
                          const checked = selectedSkillIds.includes(skill.id);
                          return (
                            <label
                              key={skill.id}
                              className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm transition-all ${
                                checked
                                  ? 'border-indigo-500/60 bg-indigo-500/10 text-slate-100'
                                  : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <span className="flex items-center gap-3">
                                <i className={`${skill.icon_key || skill.icon} text-base text-slate-300`}></i>
                                {skill.name}
                              </span>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  setSelectedSkillIds((prev) =>
                                    prev.includes(skill.id)
                                      ? prev.filter((id) => id !== skill.id)
                                      : [...prev, skill.id]
                                  )
                                }
                                className="h-4 w-4 accent-indigo-500"
                              />
                            </label>
                          );
                        })}
                    </div>
                  </div>
                  
                  <FormInput label="URL da Imagem (Supabase/Ext)" value={editingItem.image_url} onChange={(e: any) => setEditingItem({...editingItem, image_url: e.target.value})} placeholder="https://..." />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Github URL" value={editingItem.github_url} onChange={(e: any) => setEditingItem({...editingItem, github_url: e.target.value})} placeholder="https://github.com/..." />
                    <FormInput label="Live Demo URL" value={editingItem.live_url} onChange={(e: any) => setEditingItem({...editingItem, live_url: e.target.value})} placeholder="https://..." />
                  </div>
                </>
              )}

              {activeTab === 'journey' && (
                <>
                  <FormInput label="Título / Cargo" value={editingItem.title} onChange={(e: any) => setEditingItem({...editingItem, title: e.target.value})} />
                  <FormInput label="Empresa / Instituição" value={editingItem.company} onChange={(e: any) => setEditingItem({...editingItem, company: e.target.value})} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Período" value={editingItem.period} onChange={(e: any) => setEditingItem({...editingItem, period: e.target.value})} placeholder="2020 - Presente" />
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tipo</label>
                      <select 
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
                        value={editingItem.type || 'experience'} 
                        onChange={e => setEditingItem({...editingItem, type: e.target.value})}
                      >
                        <option value="experience">Experiência Profissional</option>
                        <option value="education">Formação Acadêmica</option>
                      </select>
                    </div>
                  </div>
                  
                  <RichTextEditor
                    label="Descrição das Atividades"
                    value={editingItem.description}
                    onChange={(next) => setEditingItem({ ...editingItem, description: next })}
                    placeholder="Descreva as atividades com formatação..."
                  />
                </>
              )}

              {activeTab === 'skills' && (
                <>
                  <FormInput label="Nome da Categoria" value={editingItem.title} onChange={(e: any) => setEditingItem({...editingItem, title: e.target.value})} placeholder="Ex: Backend" />
                  <FormInput label="Subtítulo (Opcional)" value={editingItem.subtitle} onChange={(e: any) => setEditingItem({...editingItem, subtitle: e.target.value})} />
                  <FormInput label="Ícone (FontAwesome)" value={editingItem.icon} onChange={(e: any) => setEditingItem({...editingItem, icon: e.target.value})} placeholder="fa-solid fa-code" />
                  
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Lista de Skills</label>
                     <p className="text-[10px] text-slate-500 mb-1">Separe os itens por ponto e vírgula (;)</p>
                     <textarea 
                         rows={4} 
                         className={`w-full bg-slate-950/50 border rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 transition-all ${
                           skillsItemsError
                             ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
                             : 'border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/20'
                         }`}
                         value={skillsItemsInput}
                         onChange={(e) => {
                           const raw = e.target.value;
                           const invalid = hasInvalidSkillsSeparator(raw);
                           setSkillsItemsInput(raw);
                           setSkillsItemsError(invalid ? SKILLS_SEPARATOR_ERROR : null);
                           setEditingItem({ ...editingItem, items: parseSkillsListInput(raw) });
                         }}
                     />
                     {skillsItemsError && (
                       <p className="text-xs text-red-400">{skillsItemsError}</p>
                     )}
                  </div>
                </>
              )}

              {activeTab === 'tech' && (
                <>
                  <FormInput
                    label="Nome da Tecnologia"
                    value={editingItem.name}
                    onChange={(e: any) => {
                      const name = e.target.value;
                      const shouldSyncSlug =
                        !editingItem.slug || editingItem.slug === slugify(editingItem.name || '');
                      setEditingItem({
                        ...editingItem,
                        name,
                        slug: shouldSyncSlug ? slugify(name) : editingItem.slug,
                      });
                    }}
                    placeholder="Ex: React, Docker"
                  />
                  <FormInput
                    label="Slug"
                    value={editingItem.slug}
                    onChange={(e: any) => setEditingItem({ ...editingItem, slug: slugify(e.target.value) })}
                    placeholder="react, docker, aws"
                  />
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                      Categoria
                    </label>
                    <select
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
                      value={editingItem.category || 'other'}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="data">Data</option>
                      <option value="infra">Infra</option>
                      <option value="ai-tools">Ferramentas de IA (apoio ao desenvolvimento)</option>
                      <option value="other">Outros</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Ícone (FontAwesome)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="fa-brands fa-react"
                        value={editingItem.icon_key || editingItem.icon || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, icon_key: e.target.value })}
                      />
                      <a
                        href="https://fontawesome.com/search"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-3 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500 transition-all flex items-center justify-center text-xs font-semibold"
                        title="Abrir Font Awesome"
                      >
                        Font Awesome
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</p>
                      <p className="text-sm text-slate-200">
                        {editingItem.is_active === false ? 'Inativo' : 'Ativo'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingItem({ ...editingItem, is_active: !(editingItem.is_active ?? true) })
                      }
                      className={`h-9 w-16 rounded-full border transition-all ${
                        editingItem.is_active === false
                          ? 'border-slate-700 bg-slate-900'
                          : 'border-emerald-500/50 bg-emerald-500/20'
                      }`}
                    >
                      <span
                        className={`block h-7 w-7 translate-x-1 rounded-full bg-white shadow transition-all ${
                          editingItem.is_active === false ? '' : 'translate-x-8'
                        }`}
                      ></span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-800 bg-slate-900 z-10">
              <div className="flex space-x-4">
                <button 
                  onClick={closeDrawer}
                  disabled={isSaving}
                  className="flex-1 py-3.5 border border-slate-700 rounded-xl text-slate-300 font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('admin.cancel')}
                </button>
                <button 
                  onClick={handleSaveItem}
                  disabled={isSaving}
                  className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:bg-slate-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isSaving ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-check"></i>}
                  {t('admin.save')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </Layout>
  );
};

export default Admin;

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getProjects } from '../data';
import { Project } from '../types';
import { useI18n } from '../i18n';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'messages' | 'settings'>('projects');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const { t, language } = useI18n();

  // Update projects when language changes
  useEffect(() => {
    setProjects(getProjects(language));
  }, [language]);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsDrawerOpen(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingProject(null);
  };

  const menuItems = [
    { id: 'projects', label: t('admin.projects'), icon: 'fa-solid fa-layer-group' },
    { id: 'messages', label: t('admin.messages'), icon: 'fa-solid fa-inbox' },
    { id: 'settings', label: t('admin.settings'), icon: 'fa-solid fa-gear' },
  ];

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-80px)] bg-slate-900">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-950 hidden md:flex flex-col">
          <div className="p-6">
            <h2 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">{t('admin.dashboard')}</h2>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id 
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <i className={`${item.icon} w-5 text-center`}></i>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-6 border-t border-slate-900">
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-green-500 flex items-center justify-center text-white font-bold">
                 AD
               </div>
               <div>
                 <p className="text-sm font-bold text-white">Alex Dev</p>
                 <p className="text-xs text-slate-500">Admin</p>
               </div>
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-50 capitalize">{menuItems.find(i => i.id === activeTab)?.label}</h1>
              <p className="text-slate-500 mt-1">{t('admin.manage')}</p>
            </div>
            {activeTab === 'projects' && (
              <button 
                onClick={handleAddNew}
                className="mt-4 md:mt-0 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center shadow-lg shadow-indigo-600/20 transition-all"
              >
                <i className="fa-solid fa-plus mr-2"></i> {t('admin.add')}
              </button>
            )}
          </div>

          {/* Content Area */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
             {activeTab === 'projects' ? (
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-900 border-b border-slate-800">
                     <tr>
                       <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.table.name')}</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.table.stack')}</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{t('admin.table.actions')}</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800">
                     {projects.map((proj) => (
                       <tr key={proj.id} className="hover:bg-slate-900/50 transition-colors group">
                         <td className="px-6 py-4">
                           <div className="flex items-center space-x-4">
                             <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden">
                               <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                             </div>
                             <div>
                               <p className="font-semibold text-white">{proj.title}</p>
                               <p className="text-xs text-slate-500 truncate max-w-[200px]">{proj.description}</p>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4">
                           <div className="flex flex-wrap gap-1">
                             {proj.tags.slice(0, 3).map(t => (
                               <span key={t} className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-400">{t}</span>
                             ))}
                             {proj.tags.length > 3 && <span className="text-xs text-slate-500 self-center">+{proj.tags.length - 3}</span>}
                           </div>
                         </td>
                         <td className="px-6 py-4 text-right">
                           <button onClick={() => handleEdit(proj)} className="text-indigo-400 hover:text-indigo-300 mr-4 transition-colors">
                             <i className="fa-solid fa-pen"></i>
                           </button>
                           <button className="text-slate-500 hover:text-red-400 transition-colors">
                             <i className="fa-solid fa-trash"></i>
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             ) : (
               <div className="p-12 text-center text-slate-500">
                 <i className="fa-solid fa-person-digging text-4xl mb-4 text-slate-700"></i>
                 <p>{t('admin.construction')}</p>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Slide-over Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={closeDrawer}
          ></div>
          
          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-slate-900 h-full shadow-2xl border-l border-slate-800 flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">
                {editingProject ? t('admin.edit') : t('admin.create')}
              </h3>
              <button onClick={closeDrawer} className="text-slate-400 hover:text-white transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">{t('admin.form.title')}</label>
                <input 
                  type="text" 
                  defaultValue={editingProject?.title}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">{t('admin.form.desc')}</label>
                <textarea 
                  rows={4}
                  defaultValue={editingProject?.description}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" 
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">{t('admin.form.image')}</label>
                <input 
                  type="text" 
                  defaultValue={editingProject?.image}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">{t('admin.form.tags')}</label>
                <input 
                  type="text" 
                  defaultValue={editingProject?.tags.join(', ')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" 
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900">
              <div className="flex space-x-4">
                <button 
                  onClick={closeDrawer}
                  className="flex-1 px-4 py-3 border border-slate-700 rounded-xl text-slate-300 font-medium hover:bg-slate-800 transition-all"
                >
                  {t('admin.cancel')}
                </button>
                <button 
                  onClick={closeDrawer}
                  className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all"
                >
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
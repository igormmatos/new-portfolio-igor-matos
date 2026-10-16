import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const tokensPath = path.join(root, 'public', 'brand', 'brand-tokens.json');

describe('canonical brand tokens', () => {
  it('matches the approved color and typography contract', () => {
    const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

    expect(tokens.colors.navy950).toBe('#020617');
    expect(tokens.colors.navy900).toBe('#0F172A');
    expect(tokens.colors.indigo600).toBe('#4F46E5');
    expect(tokens.colors.indigo400).toBe('#818CF8');
    expect(tokens.colors.blue500).toBe('#3B82F6');
    expect(tokens.colors.green500).toBe('#22C55E');
    expect(tokens.colors.offWhite).toBe('#F8FAFC');
    expect(tokens.colors.slate400).toBe('#94A3B8');
    expect(tokens.typography.heading.family).toBe('Space Grotesk');
    expect(tokens.typography.body.family).toBe('Inter');
    expect(tokens.usage.green500.role).toBe('functional');
    expect(tokens.usage.green500.role).not.toBe('primary');
  });
});

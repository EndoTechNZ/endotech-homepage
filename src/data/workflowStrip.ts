export type WorkflowStepId =
  | 'assess'
  | 'access'
  | 'glide'
  | 'shape'
  | 'clean'
  | 'seal'
  | 'restore';

export type WorkflowIconId =
  | 'assess'
  | 'access'
  | 'glide'
  | 'shape'
  | 'clean'
  | 'seal'
  | 'restore';

export interface WorkflowStripItem {
  id: WorkflowStepId;
  step: string;
  note: string;
  href: string;
  icon: WorkflowIconId;
}

export function getWorkflowStripItems(base: string): WorkflowStripItem[] {
  return [
    {
      id: 'assess',
      step: 'Assess',
      note: 'Identify anatomy, curvature, and clinical risk.',
      href: `${base}technology/transform-technology/`,
      icon: 'assess',
    },
    {
      id: 'access',
      step: 'Access',
      note: 'Create a stable path that supports controlled entry.',
      href: `${base}technology/avatar-tip/`,
      icon: 'access',
    },
    {
      id: 'glide',
      step: 'Glide',
      note: 'Establish reproducible rotary access before shaping.',
      href: `${base}products/acrobat-glide-path/`,
      icon: 'glide',
    },
    {
      id: 'shape',
      step: 'Shape',
      note: 'Develop taper while preserving working length.',
      href: `${base}products/overview/`,
      icon: 'shape',
    },
    {
      id: 'clean',
      step: 'Clean',
      note: 'Support irrigant exchange through disciplined preparation.',
      href: `${base}products/vortiflow-irrigation-needle/`,
      icon: 'clean',
    },
    {
      id: 'seal',
      step: 'Seal',
      note: 'Complete the prepared canal with bioceramic consistency.',
      href: `${base}products/bcs/`,
      icon: 'seal',
    },
    {
      id: 'restore',
      step: 'Restore',
      note: 'Move to a stable restorative endpoint.',
      href: `${base}resources/clinical-tips/`,
      icon: 'restore',
    },
  ];
}

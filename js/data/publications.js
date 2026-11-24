/**
 * Publications & Technical Writing Archive
 */
export const PUBLICATIONS = [
  {
    id: 'aethercast-2026',
    year: '2026',
    status: 'UNDER REVIEW // FIRST AUTHOR',
    venue: 'AI4Science Track Workshop at NeurIPS 2026',
    title: 'Physics-Informed Fourier Neural Operators for Localized 2D Atmospheric Transport Nowcasting',
    authors: 'Shanmitha T. (Double-blind review — coauthors withheld)',
    doi: null,
    links: [
      { label: 'Code Repository', url: 'https://github.com/shanmithat/AetherCast' },
      { label: 'HF Space', url: 'https://huggingface.co/spaces/shanmithat/aethercast' },
      { label: 'Case Study', url: 'project.html?id=aethercast' }
    ],
    abstract:
      'Investigates soft finite-difference PDE residual regularization in a 2D Fourier Neural Operator (106,264 parameters) for multi-step advection–diffusion–decay transport. Scaling training data from 64 to 1024 trajectories reduces evaluation MSE by 79.4% and Relative L2 error by 52.1%; on 1,000 trajectories, PI-FNO achieves 7.5% lower MSE and 39.5% lower PDE residual than unregularized FNO.',
    bibtex: `@inproceedings{shanmitha2026aethercast,\n  title={Physics-Informed Fourier Neural Operators for Localized 2D Atmospheric Transport Nowcasting},\n  author={Shanmitha, T.},\n  booktitle={AI4Science Track Workshop at NeurIPS 2026 (Under Review)},\n  year={2026}\n}`
  },
  {
    id: 'hydrangea-2025',
    year: '2025',
    status: 'PUBLISHED // ACL ANTHOLOGY',
    venue: 'Proceedings of the Fifth Workshop on Speech, Vision, and Language Technologies for Dravidian Languages (DravidianLangTech 2025), pp. 580–584',
    title: 'Hydrangea@DravidianLangTech2025: Abusive Language Identification from Tamil and Malayalam Text using Transformer Models',
    authors: 'Shanmitha Thirumoorthy, Thenmozhi Durairaj, and Ratnavel Rajalakshmi',
    doi: '10.18653/v1/2025.dravidianlangtech-1.100',
    links: [
      { label: 'DOI / ACL Anthology', url: 'https://doi.org/10.18653/v1/2025.dravidianlangtech-1.100' },
      { label: 'Repository', url: 'https://github.com/shanmithat/Hydrangea' }
    ],
    abstract:
      'Transformer-based classification system for abusive language identification in low-resource Tamil and Malayalam social media text.',
    bibtex: `@inproceedings{thirumoorthy-etal-2025-hydrangea,\n  title={Hydrangea@DravidianLangTech2025: Abusive Language Identification from Tamil and Malayalam Text using Transformer Models},\n  author={Thirumoorthy, Shanmitha and Durairaj, Thenmozhi and Rajalakshmi, Ratnavel},\n  booktitle={Proceedings of the Fifth Workshop on Speech, Vision, and Language Technologies for Dravidian Languages},\n  year={2025},\n  pages={580--584},\n  doi={10.18653/v1/2025.dravidianlangtech-1.100}\n}`
  },
  {
    id: 'fire-2023',
    year: '2023',
    status: 'PUBLISHED // CEUR-WS VOL-3681',
    venue: 'FIRE 2023 Working Notes, CEUR-WS Vol-3681, pp. 299–305',
    title: 'A Few Shot Learning to Detect Sarcasm in Tamil and Malayalam Code Mixed Data',
    authors: 'Shanmitha Thirumoorthy, Manavh N. R., Thenmozhi Durairaj, and Ratnavel Rajalakshmi',
    doi: null,
    links: [
      { label: 'CEUR-WS Proceedings', url: 'https://ceur-ws.org/Vol-3681/' },
      { label: 'Repository', url: 'https://github.com/shanmithat/Hydrangea' }
    ],
    abstract:
      'Few-shot learning approach for detecting sarcasm in code-mixed Tamil–English and Malayalam–English text.',
    bibtex: `@inproceedings{thirumoorthy2023fewshot,\n  title={A Few Shot Learning to Detect Sarcasm in Tamil and Malayalam Code Mixed Data},\n  author={Thirumoorthy, Shanmitha and Manavh, N. R. and Durairaj, Thenmozhi and Rajalakshmi, Ratnavel},\n  booktitle={FIRE 2023 Working Notes, CEUR-WS Vol-3681},\n  pages={299--305},\n  year={2023}\n}`
  }
];

export const TECHNICAL_NOTES = [
  {
    code: 'NOTE-01',
    title: 'BP-001-CIM Simulation Acceptance Report (Gates A–G)',
    meta: '2026-10-24 // CAD Audit, SimPy Parity, MicroWear-PINN Adapter & CRN Experiments',
    url: 'project.html?id=bp001-cim'
  },
  {
    code: 'NOTE-02',
    title: 'MicroWear-PINN Mathematical Formulation & Autograd Checks',
    meta: 'Archard Kinetics × Airy Biharmonic Potential × Hertzian Force Conservation',
    url: 'project.html?id=microwear-pinn'
  },
  {
    code: 'NOTE-03',
    title: 'DynaMesh-Thermal CUDA Memory & Sparse Krylov Architecture',
    meta: 'Unified Memory + Inline Ghost-Cell Stencils + cuSPARSE BiCGStab + CUB Reductions',
    url: 'project.html?id=dynamesh-thermal'
  }
];

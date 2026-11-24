/**
 * Structured Project Archive Data
 * Edit this file to add new case files without touching HTML templates.
 */
export const PROJECTS = [
  {
    id: 'pedigait',
    num: '01',
    name: 'PediGait',
    subtitle: '3D Digital Twin & Biomechanical Workstation for Pediatric Gait',
    domain: 'Biomechanics',
    domains: ['Biomechanics', 'Scientific ML'],
    status: 'COMPLETED IMPLEMENTATION // CLINICAL VALIDATION PENDING',
    tone: 'green',
    featured: true,
    stack: ['Python', 'PyTorch', 'ezc3d', 'NumPy', 'SciPy', 'Plotly', 'Streamlit', 'HTML/JS'],
    repo: 'https://github.com/shanmithat/pedigait',
    demo: 'https://shanmithat.github.io/pedigait/',
    previewImg: 'assets/projects/pedigait/Fig_4_2_Digital_Twin_Rig.png',
    previewCap: 'FIG 4.2 // 3D DIGITAL TWIN SKELETAL RIG',
    summary:
      'End-to-end computational biomechanics pipeline transforming optical C3D motion-capture trials into normalized 3D skeletal digital twins, Knee Swing Symmetry/Severity (KSwS) analytics, Temporal CNN-BiLSTM classification, and RegularizedPINN joint-torque prediction.',
    problem:
      'Pathological pediatric gait assessment (cerebral palsy vs. typically developing cohorts) generates dense multi-marker 3D motion-capture streams that are time-consuming to normalize, compare bilaterally, and translate into interpretable joint-level mechanical insights.',
    biomechanics:
      'Processes standard biomechanical C3D recordings via ezc3d across pelvis and lower-limb optical markers (LASI/RASI/LPSI/RPSI, LTHI/LKNE/LTIB/LANK/LHEE/LTOE). Normalizes sagittal, frontal, and transverse trajectories to a 0–100% gait cycle and computes bilateral Symmetry Index, Pearson correlation, and continuous Knee Swing Symmetry/Severity (KSwS) scores across five severity bands (Normal 0.00–0.20 through Critical 0.80–1.00) plus crouch, stiff-knee, jump, and equinus pattern flags.',
    architecture:
      'Combines two implemented modeling tracks in pedigait.ipynb and the pedigait package: (1) a RegularizedPINN(in_channels=18, out_channels=9, hidden_dim=128) physics-informed neural network for joint-torque prediction paired with an interactive Plotly/HTML 3D digital-twin workstation; and (2) a Temporal Conv1D + 2-layer Bidirectional LSTM classifier for 6-class KSwS severity prediction.',
    equations: [
      {
        label: 'Bilateral Gait Normalization & KSwS Index',
        tex: '\\hat{\\theta}(\\tau) = \\mathcal{I}_{0\\to 100\\%}\\!\\left(\\theta(t)\\right), \\quad \\mathrm{KSwS} \\in [0, 1] \\;\\mapsto\\; \\{\\text{Normal},\\text{Mild},\\text{Mod.},\\text{Sev.},\\text{Crit.}\\}'
      },
      {
        label: 'RegularizedPINN Joint-Torque Mapping (pedigait.ipynb)',
        tex: '\\mathcal{F}_{\\theta}: \\mathbf{x}(t) \\in \\mathbb{R}^{18} \\xrightarrow{\\text{Conv1D + Physics Reg.}} \\hat{\\boldsymbol{\\tau}}(t) \\in \\mathbb{R}^{9}'
      }
    ],
    results: [
      'Patient-separated 10-fold cross-validation across 1,719 gait cycles from 356 patients (6-class KSwS task): Temporal CNN achieved 59.86% accuracy, 62.74% balanced accuracy, and 58.89% macro F1 (vs. Logistic Regression baseline: 55.38% accuracy, 54.86% balanced accuracy, 53.02% macro F1).',
      'Working RegularizedPINN checkpoint (best_pediatric_pinn.pt) and interactive 3D digital-twin workstation deployed with C3D upload, TD vs. CP comparison, and exportable HTML animations.',
      'Status boundary: predictive model and digital-twin visualization are complete; external clinical validation against gold-standard laboratory measurements remains pending.'
    ],
    figures: [
      { src: 'assets/projects/pedigait/Fig_4_1_Methodology_Flowchart.png', cap: 'FIG 4.1 // C3D Ingestion, Kinematic Normalization & Modeling Pipeline' },
      { src: 'assets/projects/pedigait/Fig_4_2_Digital_Twin_Rig.png', cap: 'FIG 4.2 // 3D Optical Marker Skeletal Wireframe Digital Twin' },
      { src: 'assets/projects/pedigait/Fig_5_1_Kinematic_Trajectories.png', cap: 'FIG 5.1 // Normalized Lower-Limb Kinematic Trajectories (0–100% Gait Cycle)' },
      { src: 'assets/projects/pedigait/Fig_5_2_ROM_Radar.png', cap: 'FIG 5.2 // Range-of-Motion Radar: TD vs. CP Cohort Profiles' },
      { src: 'assets/projects/pedigait/Fig_5_3_Confusion_Matrix.png', cap: 'FIG 5.3 // 10-Fold Patient-Separated 6-Class KSwS Confusion Matrix' }
    ]
  },
  {
    id: 'bp001-cim',
    num: '02',
    name: 'BP-001-CIM // Manufacturing Digital Twin',
    subtitle: 'CAD-to-Shopfloor Computer-Integrated Manufacturing Digital Twin with MicroWear-PINN',
    domain: 'Manufacturing',
    domains: ['Manufacturing', 'Computational Mechanics', 'Scientific ML'],
    status: 'COMPLETED SIMULATION // GATE G REVIEW',
    tone: 'orange',
    featured: true,
    stack: ['SolidWorks', 'STEP/STL (trimesh)', 'SimPy', 'PyTorch (MicroWear-PINN)', 'Fusion 360 CAM', 'Streamlit', 'Plotly', 'pytest'],
    repo: 'https://drive.google.com/drive/folders/1g4MK8NzGblefBMPGgZ04AZ3DElYhRZJe?usp=sharing',
    repoLabel: 'PROJECT ARCHIVE (DRIVE)',
    demo: null,
    previewImg: 'assets/projects/cim/factory_replica_3d_isometric.png',
    previewCap: 'FIG 02 // 3D SHOPFLOOR DIGITAL TWIN REPLICA',
    summary:
      'End-to-end discrete-event Computer-Integrated Manufacturing (CIM) digital twin built around SolidWorks component BP-001, connecting STEP/STL CAD parsing, process planning, Fusion 360 CAM/tool libraries, SimPy shopfloor simulation, scheduling policies, economics, and domain-guarded MicroWear-PINN tool-wear inference.',
    problem:
      'Connecting CAD part geometry to shopfloor scheduling, CNC tool-condition maintenance, CMM quality gates, and unit-cost economics typically lives in disconnected silos. Without a unified simulation pipeline, it is difficult to evaluate how predictive tool-wear models actually affect scrap, downtime, and cost per accepted part.',
    biomechanics:
      'Authoritative CAD geometry parsed from BP-001.step / .SLDPRT / .STL: 120 × 70 × 10 mm plate (60,905.97 mm³ net volume) with two 30 × 50 × 7.50 mm pockets, R2.0 mm fillets, and 4× M5 × 1.0 corner threaded holes (Ø4.00 mm minor bore, ≈2.46 mm edge-wall thickness) machined from 125 × 75 × 12 mm provisional J45 Carbon Steel stock across operations OP00–OP70.',
    architecture:
      'SimPy discrete-event factory (ST_REC → ST_PREP → single-setup 3-axis VMC CNC_VMC_01 with ATC for OP20 Face Milling, OP30 Pocket Milling, OP40 Drilling/Tapping → ST_DEBURR → CMM_INSP_01) coupled with a 9-page Streamlit dashboard, synthetic sensor bus (AC, vibration, temperature, AE), economics calculator, and a domain-guarded MicroWear-PINN adapter (Mahalanobis distance D_M = 1.41 ≤ 3.0) restricted strictly to OP20 70 mm KC710 face milling.',
    equations: [
      {
        label: 'Deterministic Factory Routing & Conservation',
        tex: '\\mathrm{OP00} \\to \\mathrm{OP10} \\to \\underbrace{\\mathrm{OP20} \\to \\mathrm{OP30} \\to \\mathrm{OP40}}_{\\text{CNC\\_VMC\\_01 (ATC)}} \\to \\mathrm{OP50} \\to \\mathrm{OP60} \\to \\mathrm{OP70}, \\quad N_{\\text{rel}} = N_{\\text{acc}} + N_{\\text{scrap}}'
      },
      {
        label: 'Mahalanobis Domain-of-Validity Guardrail (OP20 Adapter)',
        tex: 'D_M(\\mathbf{x}) = \\sqrt{(\\mathbf{x} - \\boldsymbol{\\mu})^\\top \\boldsymbol{\\Sigma}^{-1} (\\mathbf{x} - \\boldsymbol{\\mu})} = 1.41 \\le \\tau = 3.0'
      }
    ],
    results: [
      'CRN multi-replication experiments (8 replications × 25 J45 Carbon Steel jobs): Baseline (NONE) yielded 20.625/25 accepted, 17.5% scrap, $68.68 ± $5.67/part; Policy A (Fixed 28 min) 24.125/25, 3.5% scrap, $65.99 ± $1.57; Policy B (Sensor Threshold) 24.375/25, 2.5% scrap, $65.92 ± $1.06; Policy C (MicroWear-PINN VB ≥ 0.26 mm) 24.375/25, 2.5% scrap, $67.27 ± $0.70 (tightest 95% CI across replications, zero missed wear failures).',
      'Scheduling comparison under Policy C: SPT cut mean waiting time to 98.02 min vs. 122.31 min (FCFS) and lifted on-time delivery from 16.0% to 29.0%.',
      'Verification: 15/15 automated pytest tests passed (including exact hand-calculated 2-job deterministic factory parity: 54.55% CNC utilisation) + 6/6 original MicroWear-PINN tests. Offline educational/simulation digital twin — not deployed on a physical factory floor.'
    ],
    figures: [
      { src: 'assets/projects/cim/fig5_cim_architecture_diagram.png', cap: 'FIG 01 // End-to-End BP-001-CIM Digital Twin Architecture' },
      { src: 'assets/projects/cim/cad_3d_geometry_views.png', cap: 'FIG 02 // BP-001 Authoritative CAD Geometry Views (STEP/STL)' },
      { src: 'assets/projects/cim/cad_engineering_drawing.png', cap: 'FIG 03 // BP-001 Engineering Drawing & Feature Dimensions' },
      { src: 'assets/projects/cim/factory_replica_3d_isometric.png', cap: 'FIG 04 // 3D Isometric Shopfloor Digital Twin Replica' },
      { src: 'assets/projects/cim/factory_replica_cnc_cell_closeup.png', cap: 'FIG 05 // CNC_VMC_01 Machining Cell Closeup' },
      { src: 'assets/projects/cim/dt_fig1_shopfloor_gantt_and_utilisation.png', cap: 'FIG 06 // Shopfloor Gantt Schedule & Machine Utilisation' },
      { src: 'assets/projects/cim/dt_fig2_sensor_bus_and_pinn_tracking.png', cap: 'FIG 07 // Multi-Channel Sensor Bus & MicroWear-PINN Tracking' },
      { src: 'assets/projects/cim/dt_fig3_cost_and_sensitivity.png', cap: 'FIG 08 // Policy Cost Comparison & Sensitivity Analysis' },
      { src: 'assets/projects/cim/dt_fig4_quality_and_metrology.png', cap: 'FIG 09 // CMM Quality & Thread Metrology Gates' },
      { src: 'assets/projects/cim/fig6_pre_vs_post_cam_comparison.png', cap: 'FIG 10 // Pre-CAM vs. Post-CAM Cycle Comparison' }
    ]
  },
  {
    id: 'microwear-pinn',
    num: '03',
    name: 'MicroWear-PINN',
    subtitle: 'Physics-Informed Contact Mechanics, Wear Kinetics & Subsurface Airy Stress',
    domain: 'Computational Mechanics',
    domains: ['Computational Mechanics', 'Scientific ML', 'Manufacturing'],
    status: 'VERIFIED PROTOTYPE + ONNX WEB',
    tone: 'green',
    featured: true,
    stack: ['PyTorch', 'Python', 'NumPy', 'SciPy', 'Random Fourier Features', 'SoftAdapt', 'AdamW + L-BFGS', 'ONNX Runtime Web'],
    repo: 'https://github.com/shanmithat/MicroWear-PINN',
    demo: 'https://shanmithat.github.io/MicroWear-PINN/',
    previewImg: 'assets/projects/microwear/subsurface_stresses_final.png',
    previewCap: 'FIELD // SUBSURFACE AIRY STRESS TENSOR',
    summary:
      'Coupled physics-informed neural framework for spatial wear-coefficient identification, evolving surface wear profile prediction, and 2D subsurface elastic stress reconstruction from sparse surface-profilometry observations.',
    problem:
      'Direct measurement of milling tool wear and subsurface contact stresses requires interrupting machining and cannot directly probe internal stresses beneath the tool-workpiece interface. Purely data-driven models drift outside sparse inspection labels.',
    biomechanics:
      'Couples Archard differential wear kinetics with 2D plane-strain linear elasticity via the Airy stress potential Φ(x, y, t) on [-L, L] × [-D, 0]. Normal wear depth maps to flank wear land VB(t) = -h(0,t)/tan(11°), while surface normal traction matches Hertzian contact pressure p(x,t) under Coulomb shear friction.',
    architecture:
      'Independent coordinate networks with Random Fourier Feature embeddings γ(x) = [cos(2πBx), sin(2πBx)]ᵀ and softplus-constrained wear coefficient k_w > 0, trained via quasi-Monte Carlo Sobol collocation, SoftAdapt dynamic loss balancing, and two-stage AdamW + L-BFGS optimization. Exported to self-contained ONNX for zero-backend browser inference.',
    equations: [
      {
        label: 'Archard Kinematic Wear Law',
        tex: '\\frac{\\partial h(x,t)}{\\partial t} = -k_w(x)\\,p(x,t)\\,v_{\\mathrm{rel}}(t), \\qquad k_w = \\ln(1 + e^{\\theta_k}) + 10^{-10} > 0'
      },
      {
        label: 'Biharmonic Airy Stress Compatibility & Cauchy Components',
        tex: '\\nabla^4 \\Phi = \\frac{\\partial^4 \\Phi}{\\partial x^4} + 2\\frac{\\partial^4 \\Phi}{\\partial x^2 \\partial y^2} + \\frac{\\partial^4 \\Phi}{\\partial y^4} = 0, \\quad \\sigma_{xx} = \\Phi_{yy},\\; \\sigma_{yy} = \\Phi_{xx},\\; \\tau_{xy} = -\\Phi_{xy}'
      }
    ],
    results: [
      'Analytical sinusoidal and Hertzian benchmarks implemented with sparse experimental surface-profilometry support.',
      'Automatic differentiation verification suite passes 2/2 autograd residual tests.',
      'Self-contained ONNX model deployed for interactive client-side WebAssembly stress-field and flank-wear evaluation.'
    ],
    figures: [
      { src: 'assets/projects/microwear/wear_profile_evolution.png', cap: 'FIG 01 // Evolving Surface Wear Profile h(x, t)' },
      { src: 'assets/projects/microwear/subsurface_stresses_final.png', cap: 'FIG 02 // Reconstructed 2D Subsurface Stress Field (Airy Potential)' },
      { src: 'assets/projects/microwear/identified_wear_coefficient.png', cap: 'FIG 03 // Inverse Identification of Spatial Wear Coefficient k_w(x)' },
      { src: 'assets/projects/microwear/loss_convergence.png', cap: 'FIG 04 // Coupled AdamW + L-BFGS Loss Convergence' },
      { src: 'assets/projects/microwear/nasa_flank_wear_calibration.png', cap: 'FIG 05 // NASA Milling Flank Wear Calibration' },
      { src: 'assets/projects/microwear/nasa_subsurface_stresses.png', cap: 'FIG 06 // Calibrated Subsurface Von Mises Stress Field' }
    ]
  },
  {
    id: 'dynamesh-thermal',
    num: '04',
    name: 'DynaMesh-Thermal',
    subtitle: 'GPU-Accelerated Multiphysics Topology Optimization Engine',
    domain: 'Computational Mechanics',
    domains: ['Computational Mechanics', 'Manufacturing'],
    status: 'COMPLETED SOLVER // CUDA',
    tone: 'orange',
    featured: true,
    stack: ['C++', 'CUDA', 'cuSPARSE', 'NVIDIA CUB', 'SIMP', 'Finite Volume Method', 'Unified Memory', 'Streamlit'],
    repo: 'https://github.com/shanmithat/DynaMesh-Thermal',
    demo: 'https://shanmithat.github.io/DynaMesh-Thermal/',
    procedural: 'dynamesh',
    previewCap: 'PROC // GPU SIMP THERMAL-FLUID FIELD',
    summary:
      'From-scratch C++/CUDA finite-volume solver for forced-convective thermal topology optimization, coupling penalized Navier–Stokes/Darcy flow with advection-diffusion heat transport without constructing dense N × N global matrices.',
    problem:
      'Optimizing conjugate heat-transfer manifolds requires solving coupled fluid momentum and thermal energy equations across hundreds of design iterations. Host-side dense matrix assembly and PCIe transfers bottleneck standard CPU workflows.',
    biomechanics:
      'Monolithic Brinkman/Navier–Stokes/Darcy formulation uses SIMP design density γ ∈ [0,1] to penalize fluid permeability α(γ) inside solid regions while interpolating thermal conductivity k(γ) in the steady advection-diffusion equation.',
    architecture:
      'Flattened 1D Unified Memory buffers (DeviceBuffer<T>) with inline __device__ __forceinline__ ghost-cell boundary evaluation, cuSPARSE BiCGStab Krylov sparse linear solves, NVIDIA CUB block-wide reductions (cub::DeviceReduce::Sum), and first-order upwind / QUICK discretization for stability in high-Péclet regimes.',
    equations: [
      {
        label: 'Penalized Navier–Stokes / Darcy Momentum',
        tex: '\\rho(\\mathbf{u}\\cdot\\nabla)\\mathbf{u} = -\\nabla p + \\mu\\nabla^2\\mathbf{u} - \\alpha(\\gamma)\\mathbf{u}, \\qquad \\nabla\\cdot\\mathbf{u} = 0'
      },
      {
        label: 'Conjugate Advection-Diffusion Thermal Transport',
        tex: '\\rho C_p(\\mathbf{u}\\cdot\\nabla T) = \\nabla\\cdot\\!\\big(k(\\gamma)\\nabla T\\big) + Q'
      }
    ],
    results: [
      'Zero dense N × N system construction; entire FVM assembly, BiCGStab sparse solve, and CUB objective reduction stay resident on GPU.',
      'Verified global energy balance (∑Q_in = ∑Q_out within <0.05% discretization error) and straight-duct analytical Hagen–Poiseuille limits.',
      'Synthesizes branched convective cooling channels minimizing global thermal compliance.'
    ],
    figures: []
  },
  {
    id: 'aethercast',
    num: '05',
    name: 'AetherCast',
    subtitle: 'Physics-Informed Fourier Neural Operators for 2D Atmospheric Transport',
    domain: 'Atmospheric Modelling',
    domains: ['Atmospheric Modelling', 'Scientific ML'],
    status: 'RESEARCH PROTOTYPE // UNDER REVIEW',
    tone: 'green',
    featured: true,
    stack: ['PyTorch', 'Python', 'NumPy', 'Fourier Neural Operators', 'Finite-Difference PDE', 'Streamlit'],
    repo: 'https://github.com/shanmithat/AetherCast',
    demo: 'https://huggingface.co/spaces/shanmithat/aethercast',
    previewImg: 'assets/projects/aethercast/trajectory_comparison_0.png',
    previewCap: 'ROLLOUT // 24-STEP ADVECTION-DIFFUSION',
    summary:
      'Scientific prototype evaluating whether incorporating a finite-difference PDE residual into a 2D Fourier Neural Operator improves physical consistency in multi-step advection-diffusion-decay transport without misclaiming operational weather forecasting or CPU speedups.',
    problem:
      'Purely data-driven neural operators can produce low pointwise MSE while violating the underlying PDE conservation laws over multi-step autoregressive or rollout predictions.',
    biomechanics:
      'Models a 24-step localized 2D atmospheric scalar transport trajectory on a 32 × 32 grid governed by advection-diffusion-decay dynamics, comparing PI-FNO against an unregularized data-driven FNO and an explicit discrete transport reference solver.',
    architecture:
      '4-layer 2D Fourier Neural Operator (106,264 parameters) mapping initial spatial fields and uniform transport velocities to future trajectories, regularized during training by a finite-difference PDE residual loss weighted by λ_phy.',
    equations: [
      {
        label: '2D Advection-Diffusion-Decay Transport PDE',
        tex: '\\frac{\\partial u}{\\partial t} + \\mathbf{v}\\cdot\\nabla u = D\\nabla^2 u - \\kappa u'
      },
      {
        label: 'Physics-Informed Operator Objective',
        tex: '\\mathcal{L}_{\\text{total}} = \\mathrm{MSE}(u_{\\text{pred}}, u_{\\text{target}}) + \\lambda_{\\text{phy}}\\|\\mathcal{R}_{\\text{FD}}(u_{\\text{pred}})\\|^2'
      }
    ],
    results: [
      'Training-data scaling (64 → 1024 trajectories): reduced evaluation MSE by 79.4% and Relative L₂ error by 52.1%.',
      'Physics-weight ablation (λ_phy = 0.01): reduced PDE residual by 36.1% with only a 2.7% MSE increase relative to the data-only model.',
      '1,000-trajectory comparison: PI-FNO achieved 7.5% lower prediction MSE and 39.5% lower PDE residual than unregularized FNO.',
      'Honest latency note: at 32 × 32, the discrete reference solver (~2.3 ms) is faster than CPU FNO inference (~23–24 ms), so no speed advantage is claimed. First-author manuscript under double-blind review (NeurIPS 2026 AI4Science Workshop).'
    ],
    figures: [
      { src: 'assets/projects/aethercast/trajectory_comparison_0.png', cap: 'FIG 01 // Trajectory Comparison Case 0: Reference vs. FNO vs. PI-FNO' },
      { src: 'assets/projects/aethercast/trajectory_comparison_4.png', cap: 'FIG 02 // Trajectory Comparison Case 4' },
      { src: 'assets/projects/aethercast/pde_vs_l2.png', cap: 'FIG 03 // Per-Sample PDE Residual vs. Relative L₂ Error (1,000 Trajectories)' },
      { src: 'assets/projects/aethercast/verification_pde.png', cap: 'FIG 04 // Discrete PDE Residual Verification' }
    ]
  },
  {
    id: 'implicit-lattice',
    num: '06',
    name: 'Implicit Lattice',
    subtitle: 'Implicit Computational Geometry Engine for Architected TPMS Matter',
    domain: 'Geometry',
    domains: ['Geometry', 'Manufacturing'],
    status: 'COMPLETED ENGINE',
    tone: 'green',
    featured: true,
    stack: ['Python', 'WebGL / GLSL', 'Three.js', 'Signed Distance Fields', 'TPMS', 'Marching Cubes', 'PyVista', 'Streamlit'],
    repo: 'https://github.com/shanmithat/implicit-modeling',
    demo: 'https://shanmithat.github.io/implicit-modeling/',
    previewImg: 'assets/projects/implicit/gyroid_dashboard.png',
    previewCap: 'TPMS // IMPLICIT GYROID FIELD',
    summary:
      'Function-defined geometric modeling engine replacing multi-gigabyte polygon meshes with analytic Signed Distance Fields evaluated directly on the GPU for Triply Periodic Minimal Surfaces (Gyroid, Schwarz P, Schwarz Diamond).',
    problem:
      'High-resolution cellular and TPMS architected lattices explode in polygon count when represented as explicit B-Rep/STL meshes, creating gigabyte-scale files that stall CAD kernels and additive slicers.',
    biomechanics:
      'Defines periodic zero-mean-curvature level sets F(x,y,z) = t with continuous functional grading (linear-axis and attractor-point thickness modulation), MeshSDF conformal trimming to arbitrary input STLs, and Gibson-Ashby effective stiffness estimation.',
    architecture:
      'Combines a WebGL 2.0 / GLSL fragment-shader raymarching compute layer for real-time million-cell evaluation with a Python/PyVista pipeline for volume fraction Monte Carlo integration, GPU slicing, and Marching Cubes binary STL export.',
    equations: [
      {
        label: 'Gyroid Implicit Level-Set Surface',
        tex: 'F_G(x,y,z) = \\sin(\\omega x)\\cos(\\omega y) + \\sin(\\omega y)\\cos(\\omega z) + \\sin(\\omega z)\\cos(\\omega x) - t(\\mathbf{x}) = 0'
      },
      {
        label: 'Schwarz Diamond (D) Surface',
        tex: 'F_D(x,y,z) = \\sin(\\omega x)\\sin(\\omega y)\\sin(\\omega z) + \\sin(\\omega x)\\cos(\\omega y)\\cos(\\omega z) + \\cos(\\omega x)\\sin(\\omega y)\\cos(\\omega z) + \\cos(\\omega x)\\cos(\\omega y)\\sin(\\omega z) - t = 0'
      }
    ],
    results: [
      'Measured >140,000× storage reduction in the evaluated benchmark (replacing an explicit 1.94 GB polygon STL mesh with compact ~13.7 KB procedural shader/SDF parameters).',
      'Analytics verified on Gyroid (28.8% volume fraction, 10.75 g estimated mass) and Diamond (30.1% volume fraction, 11.23 g) specimens.',
      'Enables interactive visualization and <0.8 ms/layer GPU slicing for additive-manufacturing workflows.'
    ],
    figures: [
      { src: 'assets/projects/implicit/gyroid_dashboard.png', cap: 'FIG 01 // Implicit Gyroid TPMS Dashboard & Analytics' },
      { src: 'assets/projects/implicit/diamond_dashboard.png', cap: 'FIG 02 // Schwarz Diamond TPMS & Functional Grading View' }
    ]
  },
  {
    id: 'cadrn',
    num: '07',
    name: 'AutoCAD-Profiler',
    subtitle: 'Automotive CAD Profiling, Spectral Segmentation & Analytical Metrology',
    domain: 'Geometry',
    domains: ['Geometry', 'Manufacturing', 'Scientific ML'],
    status: 'COMPLETED SYSTEM',
    tone: 'blue',
    featured: false,
    stack: ['TypeScript', 'React 18', 'Three.js', 'opencascade.js (WASM)', 'FastAPI', 'pythonocc-core', 'PyTorch Geometric', 'ONNX'],
    repo: 'https://github.com/shanmithat/cadrn',
    demo: 'https://shanmithat.github.io/cadrn/',
    procedural: 'cad-metrology',
    previewCap: 'METROLOGY // B-REP & INERTIA TENSOR',
    summary:
      'Dual-architecture automotive CAD profiling system (100% client-side WebAssembly/WebGPU SPA + FastAPI/OpenCASCADE microservice) performing B-Rep & mesh decomposition, PointNeXt embedding, exact Divergence Theorem metrology, and DFM checks.',
    problem:
      'Flattened or merged automotive CAD assemblies lack clean part trees, requiring automated geometric decomposition, mass/inertia metrology, and design-for-manufacturing (DFM) screening.',
    biomechanics:
      'Evaluates exact volume and centroid via the Divergence Theorem, full 3×3 principal inertia tensor via Eberly/Mirtich tetrahedral integration and Parallel Axis Theorem (steel ρ = 7,850 kg/m³), cotangent Laplace-Beltrami operators, and interior ray-cast wall thickness.',
    architecture:
      'B-Rep seam graph cuts and dual-mesh normalized spectral clustering paired with a PointNeXt GNN (InfoNCE contrastive objective) and automated DFM rule checks (undercuts, zero-draft, aspect ratio).',
    equations: [
      {
        label: 'Divergence Theorem Volume & Principal Inertia',
        tex: 'V = \\frac{1}{6}\\sum_t \\mathbf{v}_0\\cdot(\\mathbf{v}_1\\times\\mathbf{v}_2), \\qquad I_{xx}^{(C)} = I_{xx}^{(O)} - \\rho V(c_y^2 + c_z^2)'
      }
    ],
    results: [
      '20/20 unit and integration tests validate Divergence Theorem metrology against analytical formulas, cotangent Laplacian row sums, spectral clustering, and FastAPI endpoints.',
      'Zero-backend WebAssembly SPA live on GitHub Pages alongside full Dockerized microservice.'
    ],
    figures: []
  },
  {
    id: 'crowd-surge',
    num: '08',
    name: 'Crowd Surge Detector',
    subtitle: 'Continuum Fluid Analogy & Optical-Flow Compaction Monitoring',
    domain: 'Computational Mechanics',
    domains: ['Computational Mechanics', 'Scientific ML'],
    status: 'COMPLETED PROTOTYPE',
    tone: 'orange',
    featured: false,
    stack: ['Python', 'OpenCV', 'PyTorch', 'Farneback Optical Flow', 'YOLO', 'Continuum Mechanics'],
    repo: 'https://github.com/shanmithat/Hydrangea',
    demo: null,
    procedural: 'crowd-flow',
    previewCap: 'CONTINUUM // VELOCITY DIVERGENCE FIELD',
    summary:
      'Applies compressible continuum mechanics analogies (mass continuity and negative velocity divergence ∇·u < 0) to dense optical-flow velocity fields for early detection of crowd compaction shock waves.',
    problem:
      'High-density pedestrian crowds transition from individual motion to collective fluid-like compression waves where localized jamming precedes crush events.',
    biomechanics:
      'Treats crowd density ρ(x,t) via ∂ρ/∂t + ∇·(ρu) = 0, tracking negative velocity divergence zones and turbulent velocity variance spikes ⟨u′²⟩.',
    architecture:
      'Combines Farneback dense optical flow with YOLO detection on live video feeds to compute spatial velocity vector fields and divergence thresholds in real time.',
    equations: [
      {
        label: 'Continuum Compaction Indicator',
        tex: '\\frac{\\partial \\rho}{\\partial t} + \\nabla\\cdot(\\rho\\mathbf{u}) = 0, \\qquad \\nabla\\cdot\\mathbf{u} < 0 \\;\\Rightarrow\\; \\text{local compaction}'
      }
    ],
    results: [
      'Processes 1080p feeds at >28 FPS on edge hardware with zero false alarms under laminar transit evaluation.'
    ],
    figures: []
  },
  {
    id: 'hydrangea-nlp',
    num: '09',
    name: 'Hydrangea // Dravidian NLP',
    subtitle: 'Abusive Language & Code-Mixed Sarcasm Detection in Tamil and Malayalam',
    domain: 'Language Technology',
    domains: ['Language Technology', 'Scientific ML'],
    status: 'PUBLISHED (ACL ANTHOLOGY & CEUR-WS)',
    tone: 'blue',
    featured: false,
    stack: ['Python', 'PyTorch', 'Transformers', 'Few-Shot Learning', 'Tamil / Malayalam'],
    repo: 'https://github.com/shanmithat/Hydrangea',
    demo: 'https://aclanthology.org/2025.dravidianlangtech-1.100/',
    procedural: 'spectral-nlp',
    previewCap: 'NLP // CODE-MIXED TRANSFORMER EMBEDDINGS',
    summary:
      'Published transformer and few-shot learning pipelines for abusive-language identification and sarcasm detection in low-resource, code-mixed Tamil and Malayalam social text.',
    problem:
      'Low-resource Dravidian languages frequently mix native scripts, Romanized transliteration, and English syntax, breaking standard monolingual moderation pipelines.',
    biomechanics:
      'Evaluated fine-tuned multilingual transformer encoders and few-shot prompting/classification strategies across DravidianLangTech 2025 and FIRE 2023 shared tasks.',
    architecture:
      'Task-specific transformer classifiers (abusive_hydrangea.py, abusivetam_hydrangea.py, abusivemal_hydrangea.py) trained on curated Tamil-English and Malayalam-English benchmarks.',
    equations: [],
    results: [
      'Published in Proceedings of DravidianLangTech 2025 (pp. 580–584, DOI: 10.18653/v1/2025.dravidianlangtech-1.100).',
      'Earlier work published in FIRE 2023 Working Notes (CEUR-WS Vol-3681, pp. 299–305).'
    ],
    figures: []
  }
];

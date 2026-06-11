import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <div className="app-kicker">VectorShift</div>
          <h1>Pipeline Builder</h1>
        </div>
        <div className="app-badge">Frontend Assessment</div>
      </header>
      <div className="pipeline-layout">
        <PipelineToolbar />
        <PipelineUI />
      </div>
      <SubmitButton />
    </div>
  );
}

export default App;

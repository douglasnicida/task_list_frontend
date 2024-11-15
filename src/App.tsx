import { useEffect, useState } from 'react';
import { Task } from './types/data.type';
import api from './services/api';
import TableComponent from './components/Table';
import CreateTaskDialog from './components/CreateTaskDialog';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
        const { data } = await api.get('/task');
        setTasks(data.payload)
    }

    async function effectAsync() {
        await fetchTasks()
    }
    
    effectAsync()
  }, [])

  return (
    <>
      <div className='px-10 pt-10'>
        <TableComponent tasks={tasks} setTasks={setTasks} />

        <div className="w-full flex justify-end my-5">
          <CreateTaskDialog tasks={tasks} setTasks={setTasks} />
        </div>

      </div>
    </>
  )
}

export default App

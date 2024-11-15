import { useEffect, useState } from 'react';
import { Task } from './types/data.type';
import api from './services/api';
import TableComponent from './components/Table';
import CreateTaskDialog from './components/CreateTaskDialog';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTasks() {
        setLoading(true)

        const { data } = await api.get('/task');
        setTasks(data.payload)

        setLoading(false)
    }

    async function effectAsync() {
        await fetchTasks()
    }
    
    effectAsync()
  }, [])

  return (
    <>
      <div className='px-10 pt-10'>
        <TableComponent tasks={tasks} setTasks={setTasks} loading={loading}/>

        <div className="w-full flex justify-end my-5">
          <CreateTaskDialog tasks={tasks} setTasks={setTasks} loading={loading} />
        </div>

      </div>
    </>
  )
}

export default App

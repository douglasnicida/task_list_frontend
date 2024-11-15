import { toast } from "react-toastify";
import api from "../services/api";
import { Task } from "../types/data.type";
import { ActionButtonsProps } from "./Table";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { TrashIcon } from "@radix-ui/react-icons";

const DeleteOptionButton = ({ task, tasks, setTasks }: ActionButtonsProps) => {
    
    async function handleDeleteTask(id: number | undefined) {
        try {
            await api.delete(`/task/${id}`)
            setTasks(tasks.filter((t: Task) => task.name !== t.name));
            toast.success(`Tarefa ${task.name} excluída com sucesso!`)
        } catch (error: any) {
            console.log(error)
            toast.error(`Não foi possível excluir a tarefa ${task.name}.`)
        }
        
    }
    
    return (
        <>
        <Dialog.Root>
            <Dialog.Trigger className="cursor-pointer">
                <Button variant="ghost" color="crimson"><TrashIcon width={20} height={20} /></Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
                <Dialog.Title>Excluir tarefa</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Deseja excluir permanentemente a tarefa {task.name}?
                </Dialog.Description>


                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            Não
                        </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button color="tomato" onClick={() => handleDeleteTask(task.id)}>Sim</Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
        </>

    )
}
 
export default DeleteOptionButton;
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useRef, useState } from "react";
import { TableComponentProps } from "./Table";
import api from "../services/api";
import { Task } from "../types/data.type";
import { toast } from "react-toastify";
import { PlusIcon } from "@radix-ui/react-icons";
import { DateTextInput } from "./DateInput";

const CreateTaskDialog = ({ setTasks }: TableComponentProps) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const costRef = useRef<HTMLInputElement>(null);
    const [cost, setCost] = useState('');
    const [dueDate, setDueDate] = useState<string>('')
    
    const [open, setOpen] = useState(false);
    
    // Função para que o campo Cost aceite apenas números
    function handleCostChange(e: any) {
        const inputValue = e.target.value;
        
        const regex = /^\d*\.?\d*$/; 
        if (regex.test(inputValue) || inputValue === '' && inputValue !== '.') {
            setCost(inputValue);
        } else {
            toast.error('Formato de custo inválido. Exs: 59.90, 1100, ...');
        }
    }

    async function handleTaskCreation(e: any) {
        e.preventDefault();
        try {
            const name = nameRef.current?.value;
            const cost = costRef.current?.value ? parseFloat(costRef.current.value) : undefined;
            
            if (!name || !cost || !dueDate) {
                toast.warn("Por favor, preencha todos os campos obrigatórios.");
                return;
            }

            const newPartialTask = {
                name,
                cost,
                dueDate
            };

            const { data } = await api.post(`/task`, newPartialTask);
            
            // Adicionando as tasks para evitar outra requisição
            setTasks((prev: Task[]) => [...prev, data.payload]);
            
            toast.success(`Tarefa ${name} criada com sucesso!`);
            setOpen(false);
        } catch (err: any) {
            // Verificando se o HTTP Code é o ConflictException
            toast.error(err.status === 409 ? "Já existe uma tarefa com esse nome!" : "Erro ao criar tarefa!");
            console.log(err)
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="cursor-pointer">
                <Button variant="outline" color="blue">Criar <PlusIcon width={20} height={20} /></Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
                <Dialog.Title>Criar Tarefa</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Preencha os detalhes da nova tarefa.
                </Dialog.Description>

                <form onSubmit={(e: any) => {handleTaskCreation(e)}}>
                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Nome*
                            </Text>
                            <TextField.Root 
                                ref={nameRef}
                                placeholder="Digite o nome da tarefa"
                                type="text"
                            />
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Custo*
                            </Text>
                            <TextField.Root 
                                ref={costRef}
                                placeholder="Insira o novo valor"
                                type="text"
                                value={cost}
                                onChange={handleCostChange}
                            >
                                <TextField.Slot>R$</TextField.Slot>
                            </TextField.Root>
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Data Limite*
                            </Text>
                            <DateTextInput dueDate={dueDate} setDueDate={setDueDate}/>
                            
                        </label>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray" onClick={() => {setDueDate('')}}>
                                Cancelar
                            </Button>
                        </Dialog.Close>
                        <Button color="jade" type="submit">Criar</Button>
                        
                    </Flex>

                </form>
            </Dialog.Content>
        </Dialog.Root>
    )
}
 
export default CreateTaskDialog;
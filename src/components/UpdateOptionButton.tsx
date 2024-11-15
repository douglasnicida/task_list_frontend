import { toast } from "react-toastify";
import api from "../services/api";
import { ActionButtonsProps } from "./Table";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { ChangeEvent, useState } from "react";
import { DateTextInput } from "./DateInput";

const UpdateOptionButton = ({ task, tasks, setTasks }: ActionButtonsProps) => {
    const [name, setName] = useState(task.name);
    const [cost, setCost] = useState(task.cost);
    const [dueDate, setDueDate] = useState(task.dueDate);
    const [open, setOpen] = useState(false);

    async function handleTaskUpdate() {
        try {
            const updatedTask = {
                name,
                cost,
                dueDate
            };
            const { data } = await api.patch(`/task/${task.id}`, updatedTask);

            const changedTasks: any = tasks.map((t) => t.id === task.id ? data.payload : t);
            setTasks(changedTasks)
            
            toast.success(`Tarefa ${task.name} atualizada com sucesso!`);
            setOpen(false);
        } catch (err: any) {
            // Verificando se HTTP Code é do Conflict Exception
            toast.error(err.status === 409 ? "Já existe uma tarefa com esse nome!" : "Erro ao atualizar tarefa, revise os campos!");
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="cursor-pointer">
                <Button variant="ghost" color="blue"><Pencil1Icon width={20} height={20} /></Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
                <Dialog.Title>Alterar tarefa</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Faça alterações na tarefa.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Nome
                        </Text>
                        <TextField.Root
                            value={name}
                            placeholder="Digite o nome da tarefa"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
                        />
                    </label>
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Custo
                        </Text>
                        <TextField.Root
                            value={cost}
                            placeholder="Insira o novo valor"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setCost(parseFloat(e.currentTarget.value))}
                        >
                            <TextField.Slot>R$</TextField.Slot>
                        </TextField.Root>
                    </label>
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Data Limite
                        </Text>
                        <DateTextInput dueDate={dueDate} setDueDate={setDueDate} />
                    </label>
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            Cancelar
                        </Button>
                    </Dialog.Close>
                    <Button color="jade" onClick={handleTaskUpdate}>Salvar</Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default UpdateOptionButton;
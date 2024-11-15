import { Table } from "@radix-ui/themes";
import { Task } from "../types/data.type";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import api from "../services/api";
import DeleteOptionButton from "./DeleteOptionButton";
import UpdateOptionButton from "./UpdateOptionButton";

export interface TableComponentProps {
    tasks: Task[]
    setTasks: Dispatch<SetStateAction<Task[]>>
}

export interface ActionButtonsProps {
    task: Task
    tasks: Task[]
    setTasks: Dispatch<SetStateAction<Task[]>>
}


const TableComponent = ({ tasks, setTasks }: TableComponentProps) => {
    const [tasksIDs, setTasksIDs] = useState<number[]>([]);
    const [dragItem, setDragItem] = useState<number | null>(null);
    const [dragItemOver, setDragItemOver] = useState<number | null>(null);

    useEffect(() => {
        const ids = tasks.map((task) => task.id) as number[];
        setTasksIDs(ids);
    }, [tasks]);

    useEffect(() => {
        async function handleChangeOrder() {
            if (tasksIDs.length > 0) {
                await api.patch('/task/order', { tasksIDs });
            }
        }
        handleChangeOrder();
    }, [tasksIDs]);

    function handleDragStart(e: React.DragEvent<HTMLTableRowElement>, key: number) {
        // dar o efeito de mover à linha desejada
        e.dataTransfer.effectAllowed = 'move';
        setDragItem(key);
    }

    function handleDragEnd() {
        setDragItem(null);
        setDragItemOver(null);
    }

    function handleDragOver(e: React.DragEvent<HTMLTableRowElement>, key: number) {
        e.preventDefault();
        setDragItemOver(key);
    }

    function handleDrop(e: React.DragEvent<HTMLTableRowElement>) {
        e.preventDefault();
        if (dragItem !== null && dragItemOver !== null && dragItem !== dragItemOver) {
            const newTasksIDs = [...tasksIDs];
            const newTasks = [...tasks];

            const currentIndex = newTasksIDs.indexOf(dragItem);
            const newIndex = newTasksIDs.indexOf(dragItemOver);

            /*
                Tasks alteradas para visualizar a mudança de fato na tabela
                    - Remove a tarefa da posição atual
                    - Insere a tarefa na nova posição
            */
            const removedTask = newTasks.splice(currentIndex, 1)[0];
            newTasks.splice(newIndex, 0, removedTask); 

            /*
                TasksIDs serão mandadas para o backend para atualizar a ordem
                    - Remove a tarefa da posição atual
                    - Insere a tarefa na nova posição
            */
            newTasksIDs.splice(currentIndex, 1);
            newTasksIDs.splice(newIndex, 0, dragItem);

            setTasks(newTasks);
            setTasksIDs(newTasksIDs);
        }

        setDragItemOver(null);
    }

    return (
        <Table.Root variant="surface" size='3' className="h-[calc(100vh-80px-40px)] overflow-y-scroll">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell align="center">Nome</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center">Custo (R$)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center">Data Limite</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center">Ações</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {tasks.map((task: Task) => {
                    const taskID: number = task.id as number;
                    const isDraggingOver = dragItemOver === taskID;
                    const costColor = task.cost >= 1000 ? 'bg-red-950' : ''
                    return (
                        <Table.Row
                            key={task.id}
                            className={`${costColor} ${isDraggingOver ? 'bg-gray-700' : ''} h-14`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, taskID)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, taskID)}
                            onDrop={handleDrop}
                        >
                            <Table.RowHeaderCell align="center">{task.name}</Table.RowHeaderCell>
                            <Table.Cell align="center">{task.cost}</Table.Cell>
                            <Table.Cell align="center">{task.dueDate}</Table.Cell>
                            <Table.Cell align="center">
                                <div className="flex gap-2 justify-center">
                                    <UpdateOptionButton task={task} tasks={tasks} setTasks={setTasks} />
                                    <DeleteOptionButton task={task} tasks={tasks} setTasks={setTasks} />
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table.Root>
    );
};

export default TableComponent;
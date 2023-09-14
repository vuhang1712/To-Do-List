import styled from "styled-components";
import { Button, Input, Space, Form, Modal } from "antd";
import { useState } from "react";

const { Search } = Input;

type ToDoType = {
  id: number;
  name: string;
};

const App: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [todoList, setTodoList] = useState<ToDoType[]>([]);
  const [loadingAddItem, setLoadingAddItem] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [currentId, setCurrentId] = useState<number>();

  const handleSaveItem = async () => {
    if (!value) return;
    setLoadingAddItem(true);

    try {
      const ids: number[] = todoList.map(({ id }) => id);
      const newTodoList =
        typeof currentId === "number"
          ? todoList.map(({ id, name }) =>
              id === currentId ? { id, name: value } : { id, name }
            )
          : [
              ...todoList,
              {
                id: !!ids.length ? Math.max(...ids) + 1 : 0,
                name: value,
              },
            ];
      await setTodoList(newTodoList);
      setValue("");
      setCurrentId(null);
    } catch {
      console.log("Error");
    } finally {
      setLoadingAddItem(false);
    }
  };

  const handleEditItem = (currentId: number, currentValue: string) => {
    setValue(currentValue);
    setCurrentId(currentId);
  };

  const handleDeleteItem = () => {
    if (typeof currentId !== "number") return;

    const newTodoList = todoList.filter(({ id }) => id !== currentId);
    setTodoList(newTodoList);
    setIsConfirmDelete(false);
  };

  return (
    <Wrapper>
      <Title>My To-Do List!</Title>

      <Form>
        <Space.Compact className="w-full mt-4">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter something"
            className="focus:border-lime-500"
          />
          <Button
            type="primary"
            loading={loadingAddItem}
            className="text-white bg-lime-600 hover:!bg-lime-500"
            onClick={handleSaveItem}
            disabled={!value}
          >
            {typeof currentId === "number" ? "Save" : "Add"}
          </Button>
        </Space.Compact>

        <Search
          placeholder="Enter a keyword..."
          loading={false}
          className="mt-4"
          onChange={(e) => setKeyword(e.target.value)}
        />
      </Form>

      <div className="text-left mt-4">
        {!!todoList.length ? (
          <ul>
            {todoList.map(
              ({ id, name }) =>
                name.includes(keyword) && (
                  <li key={id} className="flex justify-between mb-2">
                    <span>{name}</span>
                    <div>
                      <Button
                        type="primary"
                        className="text-white bg-blue-600"
                        onClick={() => handleEditItem(id, name)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="primary"
                        danger
                        className="ml-2 text-white bg-red-600"
                        onClick={() => {
                          setIsConfirmDelete(true);
                          setCurrentId(id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                )
            )}
          </ul>
        ) : (
          <p>Todo List is empty!</p>
        )}
      </div>

      <Modal
        title="Do you want to delete this note?"
        open={isConfirmDelete}
        onOk={handleDeleteItem}
        onCancel={() => setIsConfirmDelete(false)}
      ></Modal>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  max-width: 50%;
  margin: auto;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 40px;
`;

// export const Title = styled.h1`
//   font-size: 40px;
//   ${tw`flex justify-center items-center h-screen`}
// `;

export default App;

import React, { useState, useEffect, Suspense, useMemo } from "react";
import {
  Loading,
  useTheme,
  Text,
  // Dropdown,
  // Modal,
  Row,
} from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import { Box } from "./Box";
import TodoCard from "./TodoCard";
import { GetTodos, AddTodo, TeamApi } from "../api/http/todosRequest";

import { Icon, Header, Input, Divider, Button, Popup, Form, Segment, Container, List, TransitionablePortal, Modal, Dropdown } from 'semantic-ui-react'



const TodoList = () => {

  const [todos, setTodos] = useState([]);
  const [task_msg, setTask_msg] = useState("Follow UP");
  const defaultcurrentDate = new Date().toISOString().split('T')[0];
  // console.log("default date value:", defaultcurrentDate);

  const [task_date, setTask_date] = useState("");
  const [task_time, setTask_time] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);


  const [UserSelected, setUserSelected] = useState("user");

  const selectedValue = useMemo(
    () => Array.from(UserSelected), [UserSelected]
  );

  // dropdown 
  const [value, setValue] = useState();

  const handleChange = (e, { value }) => {
    setValue(value);
    console.log("user selected Value:", value)
  };



  useEffect(() => {

    GetTodos()
      .then((res) => {
        console.log("task data:", res.data);
        setTodos(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });

    TeamApi().then((res) => {
      console.log("user data:", res.data);
      setUsers(res.data.results.data);

    }).catch((err) => {
      console.log(err);
    });


  }, []);


  // TO close Modal
  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };


  const notify = (proccess) => toast(proccess);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddTodo()
    }
  }

  const handleAddTodo = () => {
    setLoading(true);
    if (task_msg.trim().length > 2) {

      let timeInSeconds;
      if (task_time) {

        //  Time Conversion HH:MM into SS
        const [hours, minutes] = task_time.split(":");
        timeInSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60;
        // console.log(timeInSeconds);
      }
      else {
        timeInSeconds = " "
      }

      // TimeZone Offset Value
      const currentDate = new Date();
      const timezoneOffsetInSeconds = Math.abs(currentDate.getTimezoneOffset() * 60);
      // console.log(timezoneOffsetInSeconds);

      AddTodo({ assigned_user: value, task_date: task_date, task_time: timeInSeconds, time_zone: timezoneOffsetInSeconds, is_completed: 0, task_msg: task_msg })
        .then((res) => {
          console.log("Response data while adding:", res.data);
          if (res.data.code === 400 || res.data.status === "error") {
            notify("Error occured while adding");
            console.log("Error occured while addng: ", res.data);
          } else {
            console.log("Response data while adding is success:", res.data.results);
            closeHandler();
            notify("Addedtasks");
            GetTodos().then((res) => {
              setTodos(res.data.results);
            })
              .catch((err) => {
                notify("Upss somethings went wrong");
              })
              .finally(() => {
                setLoading(false);
                notify("Success");


                setTask_date("");
                setTask_time("");
              });
          }

        })
        .catch((err) => notify("Upss somethings went wrong"))
        .finally(() => {
        })
    } else {
      notify("Todo content length min 3 characters")
    }
  };






  if (todos) {
    return (
      <Suspense
        fallback={
          <Box
            css={{
              width: "100%",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loading
              type="default"
              loadingCss={{ $$loadingSize: "100px", $$loadingBorder: "10px" }}
            />
          </Box>
        }
      >

        {/* adding Task Modal */}
        <Modal
          closeButton

          aria-labelledby="adding_task"
          open={visible}
          onClose={closeHandler}
          style={{ width: "366px" }}
        >
          <Modal.Header>
            <h3>Adding Task</h3>
          </Modal.Header>

          <Modal.Content>
            <Form>
              <Form.Field>
                <label>Task Description</label>
                <input defaultValue="Follow up" onChange={(e) => setTask_msg(e.target.value)}
                  onKeyDown={handleKeyDown} />
              </Form.Field>

              <Form.Group widths='equal'>
                <Form.Input type="date" defaultValue={defaultcurrentDate} label='Date' icon='calendar alternate outline' iconPosition='left'
                  onChange={(event) => {
                    const newDate = event.target.value;
                    const formattedDate = new Date(newDate).toISOString().split("T")[0];
                    console.log("selected date", newDate);
                    console.log("formated date", formattedDate);
                    setTask_date(formattedDate)
                  }}

                />
                <Form.Input icon="clock outline" iconPosition='left' type="time" name="time" label='Time' placeholder='Time' f
                  onChange={(event) => {
                    const newTime = event.target.value;
                    console.log(newTime);
                    setTask_time(newTime);
                  }}
                />
              </Form.Group>


              <Form.Field>
                <label>Assign User</label>
                <Dropdown
                  // options={getoptions(users)}
                  selection={true}
                  value={value}
                >
                  <Dropdown.Menu>
                    {users.map((option, idx) => (
                      <Dropdown.Item key={idx} text={option.name} value={option.id} image={{ avatar: true, src: option.icon }} onClick={handleChange} />
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Field>
            </Form>

            {/* {console.log("users", users)}
            {console.log("slected value", selectedValue)}
            {console.log("uservalue value", UserSelected)} */}
          </Modal.Content>
          <Modal.Actions>
            <Button basic onClick={closeHandler}>
              Cancel
            </Button>

            <Button floated="right" onClick={handleAddTodo} color='teal' auto style={{ marginLeft: 40 + 'px' }}   >
              Save
            </Button>
          </Modal.Actions>
        </Modal>

        <Container text style={{ width: "366px", margin: "30px" }}>
          <Segment secondary style={{ height: "37px", display: "flex", alignItems: "center", paddingRight: "0px" }}>
            <p style={{ flex: "1 1 auto", margin: "0px", }}> Task({todos.length})</p>
            <Popup inverted content='New Task'
              trigger={<Button style={{ margin: "0" }} basic icon='add' onClick={handler} />}
            />
          </Segment>

          <Container text>
            {todos.map((item) => (
              <TodoCard key={item.id}
                setLoading={setLoading}
                setTodos={setTodos}
                item={item}

              />
            ))}
          </Container>
        </Container>

        <ToastContainer
          position="bottom-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover

        />
      </Suspense>
    );
  }
  if (isLoading === true) {
    return (
      <Box
        css={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading
          type="default"
          loadingCss={{ $$loadingSize: "100px", $$loadingBorder: "10px" }}
        />
      </Box>
    );
  }
};

export default TodoList;

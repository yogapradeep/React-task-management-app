import React, { useState, useEffect, useMemo } from "react";
import {
  Text,
  Modal,
  Dropdown
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { DeleteTodo, GetTodos, UpdateTodo, TeamApi } from "../api/http/todosRequest";

import { Icon, Header, Input, Divider, Button, Popup, Form, Segment, List, Image, } from 'semantic-ui-react'

const TodoCard = ({ item, setTodos, setLoading }) => {

  const [task_msg, setTask_msg] = useState(item.task_msg);
  const [task_date, setTask_date] = useState(item.task_date);
  const [completed, setCompleted] = useState(0);
  const [users, setUsers] = useState([]);
  const [UserSelected, setUserSelected] = useState("user");

  const selectedValue = useMemo(
    () => Array.from(UserSelected), [UserSelected]
  );

  useEffect(() => {
    TeamApi().then((res) => {
      setUsers(res.data.results.data);
      // console.log("userdata @ todocard:", res.data.results.data);

    }).catch((err) => {
      console.log(err);
    });

  }, []);





  //  Date & Time Manipulation

  // Split the date string into year, month, and day components
  const [year, month, day] = item.task_date.split('-');

  // Rearrange the components in the desired format
  const formattedDate = `${day}-${month}-${year}`;

  // console.log(formattedDate); // Output: 01-06-2023


  const hours = Math.floor(item.task_time / 3600);
  const minutes = Math.floor((item.task_time % 3600) / 60);
  const period = hours >= 12 ? 'pm' : 'am';

  const formattedTime = `${String(hours % 12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}${period}`;


  // Show date & time on update modal
  const totalSeconds = item.task_time; //  time in seconds

  const updatehours = Math.floor(totalSeconds / 3600);
  const updateminutes = Math.floor((totalSeconds % 3600) / 60);

  const updateformattedTime = `${updatehours.toString().padStart(2, "0")}:${updateminutes.toString().padStart(2, "0")}`;

  // console.log("Formatted time:", updateformattedTime);


  const [task_time, setTask_time] = useState(updateformattedTime);
  // console.log(formattedTime); // Output: "01:30am"


  const currentDate = new Date();
  const timezoneOffsetInSeconds = Math.abs(currentDate.getTimezoneOffset() * 60);


  //  Time Conversion HH:MM into SS

  const [reupdatehours, reupdateminutes] = task_time.split(":");
  const timeInSeconds = parseInt(reupdatehours) * 3600 + parseInt(reupdateminutes) * 60;
  // console.log(timeInSeconds);


  // To Modal close
  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
  };


  const notify = (proccess) => toast(proccess);

  const handleDeleteTodo = (id) => {
    setLoading(true);
    DeleteTodo(id)
      .then((res) => {
        closeHandler();
        notify("Deleting")
        GetTodos().then((res) => setTodos(res.data.results));
        notify("Deleted");
      })
      .catch((err) => {
        notify("Upss somethings went wrong")
      })
      .finally(() => {


      });
    setLoading(false);
  };


  const handleSetCompleted = (id) => {

    UpdateTodo(id, {
      "assigned_user": item.assigned_user,
      "task_date": item.task_date,
      "task_time": item.task_time,
      "is_completed": completed,
      "time_zone": item.time_zone,
      "task_msg": task_msg === "" ? item.task_msg : task_msg

    })
      .then((res) => {
        notify("Updating");
        if (res.data.code === 400 || res.data.status === "error") {
          notify("Error occured while updating");
          console.log("Error occured while updating: ", res.data);
          throw (res);
        } else {
          notify("Updated");

        }
      })

      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        GetTodos().then((res) => setTodos(res.data.results));
      });
  };


  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleUpdateTodo(item.id)
    }
  }

  const handleUpdateTodo = (id) => {
    const query = {
      task_msg: task_msg === "" ? item.task_msg : task_msg,
      task_date: task_date === item.task_date ? item.task_date : task_date,
      task_time: timeInSeconds === item.task_time ? item.task_time : timeInSeconds,
      time_zone: timezoneOffsetInSeconds === item.time_zone ? item.time_zone : timezoneOffsetInSeconds,
      is_completed: completed === item.is_completed ? item.is_completed : completed,
      assigned_user: selectedValue[0] === item.assigned_user ? item.assigned_user : selectedValue[0],

    };

    UpdateTodo(id, query)
      .then((res) => {
        closeHandler();
        notify("Updating")
        console.log("update response data", res.data);
        if (res.data.code === 400 || res.data.status === "error") {
          notify("Error occured while updating");
          console.log("Error occured while updating: ", res.data);
        } else {
          notify("Updated");
          console.log("updated successfully", res.data);
          GetTodos().then((res) => setTodos(res.data.results));
        }
      })
      .catch((err) => {

      })
      .finally(() => {

      });

    setVisible(false);
  };




  return (
    <>
      {/* Task Card */}


      {/* <Image avatar src='https://react.semantic-ui.com/images/avatar/small/rachel.png' /> */}
        {/* <List.Header as='a'>{item.task_msg}</List.Header> */}
      {/* <List.Item>
      <List.Content>
        <List.Description>
        <Text h3>{item.task_msg}</Text>
        <Text h5>{formattedDate} at {formattedTime}</Text>
        <Popup inverted content='Edit This Task' trigger={<Button basic icon='pencil' onClick={handler} />} />
        <Popup inverted content='Complete This Task' trigger={<Button basic icon='check' onClick={() => handleSetCompleted(item.id)} />} />
        </List.Description>
      </List.Content>
    </List.Item> */}

      <Segment padded key={item.id} style={{display: "flex", }}>
        <div style={{flex: "1 1 auto"}} >
        <Header style={{margin: 0 + 'px'}} size='medium'>{item.task_msg}</Header>
        <Header style={{margin: 0 + 'px'}} size='tiny'>{formattedDate} at {formattedTime}</Header>
        </div>
      <div floated="right">
      <Popup inverted content='Edit This Task' trigger={<Button basic icon='pencil' onClick={handler} />} />
        <Popup inverted content='Complete This Task' trigger={<Button basic icon='check' onClick={() => handleSetCompleted(item.id)} />} />
      </div>
       
        
      </Segment>
      {/* <Text h5>Date,Time, Zone format to API</Text>
      <Text h5>{item.task_date}</Text>
      <Text h6>{item.task_time}</Text>
      <Text h6>{item.time_zone}</Text> */}



      {/* Update Modal */}
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text >
            <h3>Update Task</h3>
          </Text>
        </Modal.Header>
        <Modal.Body>
        <Form>
              <Form.Field>
                <label>Task Description</label>
                <input value={task_msg}  onChange={(e) => setTask_msg(e.target.value)}
                  onKeyDown={handleKeyDown} />
              </Form.Field>

              <Form.Group widths='equal'>
                <Form.Input type="date" value={task_date} fluid label='Date' icon='calendar alternate outline' iconPosition='left'
                  onChange={(event) => {
                    const newDate = event.target.value;
                    const formattedDate = new Date(newDate).toISOString().split("T")[0];
                    console.log("selected date", newDate);
                    console.log("formated date", formattedDate);
                    setTask_date(formattedDate)
                  }}

                />
                <Form.Input icon="clock outline" iconPosition='left' type="time" name="time" label='Time' placeholder='Time' fluid 
                 value={task_time}
                 onChange={(event) => {
                   const newTime = event.target.value;
                   console.log(newTime);
                   setTask_time(newTime);
                 }}
                 
                />
              </Form.Group>
              <Form.Group >
             
            <Popup inverted content='Delete Task' trigger={<Button basic icon='trash alternate outline' onClick={() => handleDeleteTodo(item.id)} />} />

              <Button auto flat  color="error" onClick={closeHandler}>
                Cancel
              </Button>

              <Button  floated="right" onClick={() => handleUpdateTodo(item.id)} color='teal' auto style={{ marginLeft: 40 + 'px' }}   >
                Save
              </Button>
              </Form.Group>

            </Form>
         
          {/* <Dropdown>
            <Dropdown.Button flat>{selectedValue}</Dropdown.Button>
            <Dropdown.Menu aria-label="Single selection actions"
              color="secondary"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={UserSelected}
              value={item.assigned_user}
              onSelectionChange={setUserSelected}
              items={users}
            >
              {(item) => (
                <Dropdown.Item key={item.id} >
                  {item.name}
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown> */}

        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TodoCard;

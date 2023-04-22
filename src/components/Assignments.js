import React, { useState , useEffect} from 'react';
import { Table, Button, Modal, Form ,Row, Col, Container} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

function Assignments() {
    // const [assignments, setAssignments] = useState([
    //     { assignment_name: "Homework 1", due_date: "2023-04-20" },
    //     { assignment_name: "Project 2", due_date: "2023-04-25" },
    //     { assignment_name: "Quiz 3", due_date: "2023-04-30" },
    // ]);
    const [assignments, setAssignments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("Add Assignment");
    const [modalAssignmentName, setModalAssignmentName] = useState("");
    const [modalDueDate, setModalDueDate] = useState("2023-01-01");
    const [modalIndex, setModalIndex] = useState(-1);
    const [next_id, setNext_id] = useState(0);
    const api_endpoint = "http://localhost:3333/api/assignments";

    useEffect(() => {
      axios.get(api_endpoint)
        .then(response => {
          setAssignments(response.data);
          setNext_id(response.data[response.data.length - 1].id + 1);
          })
        .catch(error => console.error(error));
      // console.log(assignments);
      // setNext_id(assignments[assignments.length - 1].id + 1);
    }, []);

    const handleEdit = (index) => {
      setModalIndex(index);
      setModalTitle("Edit Assignment");
      setModalAssignmentName(assignments[index].assignment_name);
      setModalDueDate(assignments[index].due_date);
      setShowModal(true);
    };

    const handleAddAssignment = () => {
      setModalIndex(-1);
      setModalTitle("Add Assignment");
      setModalAssignmentName("");
      setShowModal(true);
    }
    

    const handleSave = () => {
      const newAssignments = assignments;
      let newOne = {
        "id" : next_id,
        "assignment_name": modalAssignmentName,
        "due_date": modalDueDate
      };
      if (modalIndex === -1) {
          newAssignments.push(newOne);
          fetch(api_endpoint, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newOne)
          })
          .then(response => response.json())
          .then(data => console.log(data)) 
          .catch(error => console.error(error)); 
          setNext_id(next_id + 1);
      } else {
        newOne.id = assignments[modalIndex].id;
        newAssignments[modalIndex] = newOne;
        fetch(api_endpoint, {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newOne)
        })
        .then(response => response.json())
        .catch(error => console.error(error)); 
      }
      setAssignments(newAssignments);
      setShowModal(false);
    }; 

    const handleDeleteAssignment = (index) => {
        const newList = [...assignments];
        newList.splice(index, 1);
        console.log(index, assignments[index]);
        fetch(api_endpoint, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({"id" : assignments[index].id})
        })
        .then(response => response.json())
        .catch(error => console.error(error)); 
        setAssignments(newList);
    };

    return(
        <Container>
            <Row className="mt-5">
                <Col>
                <h1 className="text-center">Assignments (TODO)</h1>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th className="text-center">Edit ?</th>
                        <th className="text-center">Assignment Name</th>
                        <th className="text-center">Due Date (YYYY-MM-DD)</th>
                        <th className="text-center">Done ?</th>
                    </tr>
                    </thead>
                    <tbody>
                    {assignments.map((assignment, index) => (
                        <tr>
                        <td className="text-center"><Button onClick={() => handleEdit(index)}>Edit</Button></td>
                        <td className="text-center">{assignment.assignment_name}</td>
                        <td className="text-center">{assignment.due_date}</td>
                        <td className="text-center"><Button variant="success" onClick={() => handleDeleteAssignment(index)}>Done</Button></td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                </Col>
            </Row>
            <Row className="mt-5 d-flex justify-content-center">
                <Col xs="auto">
                <Button variant="primary" onClick= {handleAddAssignment}>Add Assignment</Button>
                </Col>
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="assignmentName">
                  <Form.Label>Assignment Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Assignment Name"
                    value={modalAssignmentName}
                    onChange={(e) => setModalAssignmentName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formDueDate">
                  <Form.Label>Due Date</Form.Label>
                  <br />
                  <DatePicker
                    selected= {new Date(modalDueDate)}
                    onChange={(date) => setModalDueDate(date.toISOString().substring(0, 10))}
                    dateFormat="yyyy-MM-dd"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
              <Button variant="primary" onClick={handleSave}>Add</Button>
            </Modal.Footer>
          </Modal>
        </Container>

    );

}

export default Assignments;

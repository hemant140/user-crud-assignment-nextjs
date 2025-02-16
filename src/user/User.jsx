'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Tag, message, Table, Modal, Form, Row, Col, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';


const columns = [
    {
        title: '#',
        dataIndex: 'key',
        key: 'key',
    },
    {
        title: 'USER',
        dataIndex: 'user',
        sorter: (a, b) => a.user.localeCompare(b.user)
    },
    {
        title: 'MOBILE',
        dataIndex: 'mobile',
    },
    {
        title: 'EMAIL',
        dataIndex: 'email',
    },
    {
        title: 'AGE',
        dataIndex: 'age',
        sorter: (a, b) => a.age.localeCompare(b.age)
    },
    {
        title: 'INTEREST',
        dataIndex: 'interest',
    },
    {
        title: 'STATUS',
        dataIndex: 'status',

    },
    {
        title: 'ACTIONS',
        dataIndex: 'action',
    },
];

function User() {
    const [UserForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [userData, setUserData] = useState(true);
    const [open, setOpen] = useState(false)
    const [fromTitle, setfromTitle] = useState('');
    const [editFlag, setEditFlag] = useState(false);
    const [formButton, setformButton] = useState('');
    const [userId, setUserId] = useState('');
    const [messageApi, contextHolder] = message.useMessage();

    const baseUrl = "http://localhost:3000/api/user"


    useEffect(() => {
        fetchData();
    }, []);



    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(baseUrl);

            console.log(response, "response")

            setUserData(response.data.data);
            setLoading(false);
        } catch (error) {
            setLoading(false)
            console.error(error);
            message.error('Internal Server Error');
        }
    };


    const handleEdit = (record) => {
        setEditFlag(true);
        setUserId(record._id)

        console.log(record)
        setfromTitle('UPDATE USER')
        setformButton('Update')
        UserForm.setFieldsValue({
            user: record.user,
            mobile: record.mobile,
            age: record.age,
            email: record.email,
            interest: record.interest

        });
        setOpen(true)

    }

    const dataSource = userData && userData.length > 0 && userData.map((user, index) => {
        return {
            key: index + 1,
            user: `${user.user}`,
            email: user.email,
            mobile: user.mobile,
            age: user.age,
            interest: user.interest && user.interest.length > 0 ? (
                user.interest.map((item, i) => (
                    <Tag color="cyan" key={i}>{item}</Tag>
                ))
            ) : (
                <Tag color="red">No Interest</Tag>
            ),
            status: <Tag color={user.status === "ACTIVE" ? "green" : "red"} className="draft">{user.status}</Tag>,
            action: (<>
                <span>
                    <EditOutlined style={{ fontSize: "18px" }} onClick={() => handleEdit(user)} />
                </span>
                <span>
                    {user.status === "ACTIVE" ? (
                        <DeleteOutlined style={{ fontSize: "18px", color: "red", cursor: "pointer", padding: "8px" }} onClick={() => handleDelete(user._id)} />
                    ) : (
                        <CheckOutlined style={{ fontSize: "18px", color: "green", cursor: "pointer", padding: "8px" }} onClick={() => handleDelete(user._id)} />
                    )}
                </span>
            </>)
        }
    })

    const showModal = () => {
        setfromTitle('ADD USER')
        setformButton('Submit')
        setEditFlag(false)
        setOpen(true)
        UserForm.resetFields()

    };

    const handleCancel = () => {
        setOpen(false)
        UserForm.resetFields()

    };

    const handleDelete = async (userId) => {
        try {
            setButtonLoading(true)

            const response = await axios.put(`${baseUrl}/${userId}`);
            if (!response) {
                message.error('Error in delete user');
                return;
            }
            setButtonLoading(false)
            setOpen(false)
            messageApi.open({
                type: 'success',
                content: "User status change successfully",
            });
            fetchData();

        } catch (error) {
            setButtonLoading(false)
            console.error(error);
            messageApi.open({
                type: 'error',
                content: 'Error in change status of user',
            });
        }
    }


    const handleSubmit = async (values) => {

        if (editFlag) {
            try {
                setButtonLoading(true)

                console.log({ ...values, userId }, "update data")
                const response = await axios.put(baseUrl, { ...values, userId });
                if (!response) {
                    messageApi.open({
                        type: 'error',
                        content: 'Error in updating user',
                    });
                    return;
                }
                setButtonLoading(false)
                setOpen(false)
                messageApi.open({
                    type: 'success',
                    content: "User updated successfully",
                });
                fetchData();

            } catch (error) {
                setButtonLoading(false)
                console.error(error);
                messageApi.open({
                    type: 'error',
                    content: 'Error in updating user',
                });
            }
        } else {
            try {
                setButtonLoading(true)
                const response = await axios.post(baseUrl, values);
                if (!response) {
                    messageApi.open({
                        type: 'error',
                        content: 'Error in adding new user',
                    });
                    return;
                }

                setButtonLoading(false)
                setOpen(false)

                messageApi.open({
                    type: 'success',
                    content: 'User added successfully!',
                });
                fetchData();

            } catch (error) {
                setButtonLoading(false)
                console.error(error);
                messageApi.open({
                    type: 'error',
                    content: 'Error in adding new user',
                });
            }
        }


    };





    return (
        <div style={{ padding: "40px 30px" }}>
            {contextHolder}
            <div className="buttonTitle">
                <h1 className='text-5xl,font-bold'>USERS</h1>
                <Button style={{ backgroundColor: '#073763', borderColor: '#073763', color: 'white' }} size="large" onClick={showModal}>Add User</Button>
            </div>
            <div className='mt-3'>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                />
            </div>

            <Modal
                title={fromTitle}
                open={open}
                onOk={handleSubmit}
                onCancel={handleCancel}
                width={700}
                maskClosable={false}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        CANCEL
                    </Button>,
                    <Button type="primary" key="submit" loading={buttonLoading} style={{ backgroundColor: '#073763', borderColor: '#073763', color: 'white' }} form="userForm" htmlType="submit">{formButton}</Button>
                ]}
            >
                <Form
                    id="userForm"
                    form={UserForm}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Row gutter={{ xs: 24, sm: 12, md: 24, lg: 24 }}>
                        <Col className='gutter-row ' xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
                            <Form.Item
                                label="User"
                                name="user"

                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter user!',
                                    },
                                ]}
                            >
                                <Input placeholder='Enter user name' />

                            </Form.Item>
                        </Col>

                        <Col className='gutter-row ' xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter user email!',
                                    },
                                    { type: 'email', message: 'Please input valid email id !' }
                                ]}
                            >
                                <Input disabled={editFlag} placeholder='Enter user email' />

                            </Form.Item>
                        </Col>

                        <Col className='gutter-row ' xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
                            <Form.Item
                                label="Mobile"
                                name="mobile"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter user mobile number!',
                                    },
                                    { len: 10, message: 'Mobile number must be exactly 10 digits!' }
                                ]}
                            >
                                <Input placeholder='Enter user mobile number' />

                            </Form.Item>
                        </Col>

                        <Col className='gutter-row ' xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
                            <Form.Item
                                label="Age"
                                name="age"

                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter user age !',
                                    },
                                ]}
                            >
                                <Input placeholder='Enter user age ' />

                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Form.Item
                                label="Interests"
                                name="interest"
                                rules={[
                                    { required: true, message: 'Please select at least one interest!' }
                                ]}
                            >
                                <Select
                                    mode="tags"
                                    placeholder="Enter or select multiple interests"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>

            </Modal>

        </div>
    )
}

export default User
import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Tag, Form, Input, Select, Row, Col, Card, Typography, Layout } from "antd";
import { SearchOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";
import "./Teacher.css";

const { Option } = Select;
const { Title } = Typography;
const { Content } = Layout;
const { Search } = Input;

const Teacher = (props) => {
  const { setCollapsedNav, successNoti } = props;
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [form] = Form.useForm();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsedNav(true);
      } else {
        setCollapsedNav(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setCollapsedNav]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.input.contains(event.target)) {
        setSearchMode(false);
      }
    };

    if (searchMode) {
      document.addEventListener("mousedown", handleClickOutside);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchMode]);

  const handleClearAll = () => {
    form.resetFields();
  };

  const handleSearchMode = () => {
    setSearchMode(!searchMode);
  };

  const handleSearch = (event) => {
    console.log("text ", event.target.value);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      render: (text, record) => (
        <Tag color={record.color}>{record.state}</Tag>
      ),
    },
    {
      title: "State Age",
      dataIndex: "stateAge",
      key: "stateAge",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "",
      key: "action",
      render: (text, record) => (
        <Button type="primary">Manage Invoice</Button>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      id: "2017W22-1",
      startDate: "29-05-2017",
      state: "AWAITING TIMESHEETS",
      color: "purple",
      stateAge: "5 hours ago",
      customer: "Anne Hathaway",
    },
    {
      key: "2",
      id: "2017W21-1",
      startDate: "22-05-2017",
      state: "AWAITING TIMESHEETS",
      color: "purple",
      stateAge: "7 hours ago",
      customer: "Bill Murray",
    },
    {
      key: "3",
      id: "2017W21-2",
      startDate: "22-05-2017",
      state: "AWAITING PAYMENT",
      color: "blue",
      stateAge: "8 hours ago",
      customer: "Theresa May",
    },
    {
      key: "4",
      id: "2017W20-21",
      startDate: "22-05-2017",
      state: "QUERIED",
      color: "red",
      stateAge: "3 days ago",
      customer: "Anthony Hopkins",
    },
    {
      key: "5",
      id: "2017W20-22",
      startDate: "18-05-2017",
      state: "PAID",
      color: "green",
      stateAge: "7 days ago",
      customer: "Albert Einstein",
    },
  ];

  return (
    <>
      <div>
        <div className="">
          <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
            Danh sách giáo viên
          </Title>
          <div className="flex text-left justify-between ml-3 mr-3 mb-5">
            <div className="flex gap-2">
              <Button
                className=""
                icon={filterVisible ? <UpOutlined /> : <DownOutlined />}
                type="default"
                onClick={() => setFilterVisible(!filterVisible)}>
                Filters
              </Button>
              <Button type="default" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>
            <div>
          {!searchMode ? (
            <Button
              onClick={handleSearchMode}
              type="primary"
              icon={<SearchOutlined />}>
              Search
            </Button>
          ) : (
            <Search
              ref={searchInputRef}
              placeholder="input search text"
              onSearch={handleSearch}
              enterButton
              allowClear
            />
          )}
        </div>
          </div>
          {filterVisible && (
            <Card style={{ marginBottom: 20 }}>
              <Form form={form} layout="vertical">
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="Customer" name="customer">
                      <Select placeholder="Select customer">
                        <Option value="A">Customer 1</Option>
                        <Option value="B">Customer 2</Option>
                        <Option value="C">Customer 3</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Status" name="status">
                      <Select placeholder="Select status">
                        <Option value="awaiting_timesheets">AWAITING TIMESHEETS</Option>
                        <Option value="awaiting_payment">AWAITING PAYMENT</Option>
                        <Option value="queried">QUERIED</Option>
                        <Option value="paid">PAID</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Amount From" name="amountFrom">
                      <Input placeholder="Amount From" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Amount To" name="amountTo">
                      <Input placeholder="Amount To" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="Request Type" name="requestType">
                      <Select placeholder="Select request type">
                        <Option value="type1">Type 1</Option>
                        <Option value="type2">Type 2</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          )}
          <Table columns={columns} dataSource={data} pagination={true} />
        </div>
      </div>
    </>
  );
};

export default Teacher;

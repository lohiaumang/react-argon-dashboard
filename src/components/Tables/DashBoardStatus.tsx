import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    CardTitle,
    CardText,
} from "reactstrap";

type Props = {
    dashBoardStatus: any;
};

const DashBoardStatus = React.forwardRef<HTMLDivElement, Props>(
    (props, ref) => {
        if (props && props.dashBoardStatus) {
            let dashBoardStatus;
            dashBoardStatus = props.dashBoardStatus


            return (
                <Row style={{ marginTop: '10px' }}>
                    <Col xl="12" className="align-items-center" >
                        <Card className="shadow">
                            <CardHeader className="bg-transparent">
                                <Row>
                                    <div className="col">
                                        <h6 className="text-uppercase text-muted ls-1 mb-1">
                                            Performance
                                        </h6>
                                        {/* <p>{dataCount}</p> */}
                                    </div>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Row style={{ marginBottom: '5px' }}>
                                    <Col xl="4">
                                        <Card body inverse color="success">
                                            <CardTitle style={{ color: 'white' }} tag="h5">DONE</CardTitle>
                                            <CardText>{dashBoardStatus.DONE}</CardText>
                                        </Card>
                                    </Col>
                                    <Col xl="4">
                                        <Card body inverse color="warning">
                                            <CardTitle style={{ color: 'white' }} tag="h5">PENDING</CardTitle>
                                            <CardText>{dashBoardStatus.PENDING}</CardText>
                                        </Card>
                                    </Col>
                                    <Col xl="4">
                                        <Card body inverse color="info">
                                            <CardTitle style={{ color: 'white' }} tag="h5">DO CREATE</CardTitle>
                                            <CardText>{dashBoardStatus.DO_CREATED}</CardText>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xl="4">
                                        <Card body inverse style={{ backgroundColor: '#31bda8', borderColor: '#31bda8' }}>
                                            <CardTitle style={{ color: 'white' }} tag="h5">INVOICE</CardTitle>
                                            <CardText>{dashBoardStatus.INVOICE_CREATED}</CardText>
                                        </Card>
                                    </Col>
                                    <Col xl="4">
                                        <Card body inverse color="primary">
                                            <CardTitle style={{ color: 'white' }} tag="h5">INSURENCE</CardTitle>
                                            <CardText>{dashBoardStatus.INSURENCE_CREATED}</CardText>
                                        </Card>
                                    </Col>
                                    <Col xl="4">
                                        <Card body inverse style={{ backgroundColor: '#8e2fbd', borderColor: '#8e2fbd' }}>
                                            <CardTitle style={{ color: 'white' }} tag="h5">INCOMPLETE</CardTitle>
                                            <CardText>{dashBoardStatus.INCOMPLETE}</CardText>
                                        </Card>
                                    </Col>
                                </Row>

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            );
        } else {
            return <></>;
        }
    }
);

export default DashBoardStatus;

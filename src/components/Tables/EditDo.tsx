import React, { useState, useEffect } from "react";
import {
  Table,
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
} from "reactstrap";
import NumberFormat from "react-number-format";
import SmallLoading from "../Share/SmallLoading";

export interface UserInfo {
  name: string;
  phoneNumber: string;
  email: string;
  gst: string;
  pan: string;
  address: string;
  temporaryCertificate: string;
  uid: string;
}

export interface DeliveryOrder {
  active: boolean;
  status: string;
  color: string;
  name: string;
  vehicleId: string;
  dealerId: string;
  deliveryId: string;
  customerId: string;
  modelName: string;
  additionalId: string;
  createdBy: string;
  id: string;
  customerInfo?: {
    idTwoPhotoString: string;
    currLineTwo: string;
    permDistrict: string;
    dob?: string;
    phoneNo: string;
    swdo?: string;
    permCity: string;
    permPS: string;
    firstName: string;
    gst?: string;
    idOnePhotoString: string;
    email: string;
    currLineOne: string;
    currPS: string;
    permLineTwo: string;
    type: string;
    currDistrict: string;
    currState: string;
    lastName?: string;
    gender?: string;
    permLineOne: string;
    currPostal: string;
    permPostal: string;
    currCity: string;
    photoString: string;
    permState: string;
  };
  vehicleInfo?: {
    color: string;
    frameNumber: string;
    engineNumber: string;
    modelName: string;
    modelCategory: string;
  };
  additionalInfo?: {
    hra: boolean;
    joyClub: boolean;
    accessories: string;
    postalCharge: string;
    ptfePolish: string;
    price: string;
    mvTax: string;
    extendedWarranty: string;
    insurance: string;
    inquiryType: string;
    financier?: string;
    downPayment?: string;
  };
  userInfo: UserInfo;
}

type Props = {
  deliveryOrder: DeliveryOrder;
};

const EditDo = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  if (
    props &&
    props.deliveryOrder &&
    props.deliveryOrder.customerInfo &&
    props.deliveryOrder.vehicleInfo &&
    // props.deliveryOrder.additionalInfo &&
    props.deliveryOrder.userInfo
  ) {
    const [disabled, setDisabled] = useState<boolean>(true);
    const [deliveryOrder, setDeliveryOrder] = useState<DeliveryOrder>(
      props.deliveryOrder
    );
    // const [userInfo, setUserInfo] = useState<UserInfo>({
    //   name: "",
    //   phoneNumber: "",
    //   email: "",
    //   gst: "",
    //   pan: "",
    //   address: "",
    //   temporaryCertificate: "",
    //   uid: "",
    // });

    return (
      <div ref={ref}>
        <Container>
          <Row>
            <Col className="order-xl-1" xl="12">
              <Row className="align-items-center">
                <Col xs="8">
                  <h3 className="mb-0">Update DO</h3>
                </Col>
              </Row>

              <Form>
                <Row>
                  <Col xs="8">
                    <h6 className="heading-small text-muted mb-4">
                      Customer information
                    </h6>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      className="small-button-width"
                      color={"success"}
                      type="submit"
                      size="sm"
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-customer-name"
                        >
                          Customer Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-customer-name"
                          value={props.deliveryOrder.customerInfo.firstName}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              name: ev.target.value!,
                            })
                          }
                          placeholder="Customer name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-customer-lastName"
                        >
                          Customer Last Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-customer-lastName"
                          value={
                            deliveryOrder && deliveryOrder.customerInfo
                              ? deliveryOrder.customerInfo.lastName
                              : ""
                          }
                          onChange={(ev) =>
                            setDeliveryOrder({
                              ...deliveryOrder,
                              customerInfo: {
                                ...deliveryOrder.customerInfo,
                                lastName: ev.target.value! || "",
                              },
                            })
                          }
                          placeholder="Customer Last Name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="S/D/W/O">
                          S/D/W/O Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="S/D/W/O"
                          value={props.deliveryOrder.customerInfo.swdo}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              name: ev.target.value!,
                            })
                          }
                          placeholder="S/D/W/O Name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-email"
                        >
                          Email address
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-email"
                          value={props.deliveryOrder.customerInfo.email}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              email: ev.target.value!,
                            })
                          }
                          placeholder="abc@xyz.def"
                          type="email"
                          pattern="^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$"
                          title="Email should be in the format abc@xyz.def"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-phone-number"
                        >
                          Phone number
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-phone-number"
                          value={props.deliveryOrder.customerInfo.phoneNo}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              phoneNumber: ev.target.value!,
                            })
                          }
                          placeholder="9999999999"
                          type="tel"
                          pattern="^\d{10}$"
                          title="Phone number should exactly contain 10 digits"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="date-of-birth"
                        >
                          Date of Birth
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="date-of-birth"
                          value={props.deliveryOrder.customerInfo.dob}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              name: ev.target.value!,
                            })
                          }
                          placeholder="Date Of Birth"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="8">
                      <h6 className="heading-small text-muted mb-4">
                        Current Address
                      </h6>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="curr-add-line-1"
                        >
                          Line 1
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="curr-add-line-1"
                          value={props.deliveryOrder.customerInfo.currLineOne}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              name: ev.target.value!,
                            })
                          }
                          placeholder="Enter address line 1"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="curr-add-line-2"
                        >
                          Line 2
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="curr-add-line-2"
                          value={props.deliveryOrder.customerInfo.currLineTwo}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              name: ev.target.value!,
                            })
                          }
                          placeholder="Enter address line 2"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input--curr-city"
                        >
                          City
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input--curr-city"
                          value={props.deliveryOrder.customerInfo.currCity}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              address: ev.target.value!,
                            })
                          }
                          placeholder="Enter city"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-curr-district"
                        >
                          District
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-curr-district"
                          value={props.deliveryOrder.customerInfo.currDistrict}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              address: ev.target.value!,
                            })
                          }
                          placeholder="Enter city"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input--curr-ps-landmark"
                        >
                          PS/Landmark
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-curr-ps-lankmark"
                          value={props.deliveryOrder.customerInfo.currPS}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              temporaryCertificate: ev.target.value!,
                            })
                          }
                          placeholder="Enter police station"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-curr-state"
                        >
                          State
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-curr-state"
                          value={props.deliveryOrder.customerInfo.currState}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              temporaryCertificate: ev.target.value!,
                            })
                          }
                          placeholder="Enter state"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-curr-postal-code"
                        >
                          Poatal Code
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-curr-postal-code"
                          value={props.deliveryOrder.customerInfo.currPostal}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              temporaryCertificate: ev.target.value!,
                            })
                          }
                          placeholder="Enter postal code"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs="8">
                      <h6 className="heading-small text-muted mb-4">
                        Present Address
                      </h6>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="pre-add-line-1"
                        >
                          Line 1
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="pre-add-line-1"
                          value={props.deliveryOrder.customerInfo.permLineOne}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              name: ev.target.value!,
                            })
                          }
                          placeholder="Enter address line 1"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="pre-add-line-2"
                        >
                          Line 2
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="pre-add-line-2"
                          value={props.deliveryOrder.customerInfo.permLineTwo}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              name: ev.target.value!,
                            })
                          }
                          placeholder="Enter address line 2"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-city"
                        >
                          City
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-city"
                          value={props.deliveryOrder.customerInfo.permCity}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              address: ev.target.value!,
                            })
                          }
                          placeholder="Enter city"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-district"
                        >
                          District
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-district"
                          value={props.deliveryOrder.customerInfo.permDistrict}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              address: ev.target.value!,
                            })
                          }
                          placeholder="Enter city"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-ps-landmark"
                        >
                          PS/Landmark
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-ps-lankmark"
                          value={props.deliveryOrder.customerInfo.permPS}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              temporaryCertificate: ev.target.value!,
                            })
                          }
                          placeholder="Enter police station"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-state"
                        >
                          State
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-state"
                          value={props.deliveryOrder.customerInfo.permState}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              temporaryCertificate: ev.target.value!,
                            })
                          }
                          placeholder="Enter state"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-postal-code"
                        >
                          Poatal Code
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-postal-code"
                          value={props.deliveryOrder.customerInfo.permPostal}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              temporaryCertificate: ev.target.value!,
                            })
                          }
                          placeholder="Enter postal code"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="8">
                      <h6 className="heading-small text-muted mb-4">
                        Bike Details
                      </h6>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-model-name"
                        >
                          Model Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-model-name"
                          value={props.deliveryOrder.vehicleInfo.modelName}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              temporaryCertificate: ev.target.value!,
                            })
                          }
                          placeholder="Enter Model Name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-colour"
                        >
                          Colour
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-colour"
                          value={props.deliveryOrder.vehicleInfo.color}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              temporaryCertificate: ev.target.value!,
                            })
                          }
                          placeholder="Enter colour"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-financier"
                        >
                          Financier Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-financier"
                          value={props.deliveryOrder.additionalInfo.financier}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              temporaryCertificate: ev.target.value!,
                            })
                          }
                          placeholder="Enter financier name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-inquiry-type"
                        >
                          Inquiry Type
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-inquiry-type"
                          value={props.deliveryOrder.additionalInfo.inquiryType.toUpperCase()}
                          onChange={(ev) =>
                            setUserInfo({
                              ...userInfo,
                              temporaryCertificate: ev.target.value!,
                            })
                          }
                          placeholder="Enter Model Name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  } else {
    return <></>;
  }
});

export default EditDo;

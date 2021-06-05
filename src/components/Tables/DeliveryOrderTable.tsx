import React, { useState, useEffect, useRef } from "react";
import { Table, Row, Col } from "reactstrap";

export interface DeliveryOrder {
  active: boolean;
  color: string;
  name: string;
  vehicleId: string;
  dealerId: string;
  deliveryId: string;
  customerId: string;
  modelName: string;
  additionalId: string;
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
}

type Props = {
  deliveryOrder: DeliveryOrder;
};

const DeliveryOrderTable: React.FC<Props> = (props) => {
  const rowLine = {
    height: "2px",
    width: "100%",
    backgroundColor: "blue",
  };

  if (
    props &&
    props.deliveryOrder &&
    props.deliveryOrder.customerInfo &&
    props.deliveryOrder.vehicleInfo &&
    props.deliveryOrder.additionalInfo
  ) {
    return (
      <div className="delivery-order-table">
        <Row>
          <Row className="row-header">
            <Col>
              <h4 className="m-0" style={{ color: "white" }}>
                Vinayak Honda
              </h4>
            </Col>
            <Col className="text-right">
              <p className="m-0" style={{ color: "white" }}>
                <small>
                  <strong>Sl. no. {props.deliveryOrder.id}</strong>
                </small>
              </p>
            </Col>
          </Row>
          <Row className="p-1 w-100">
            <Col sm="6" className="p-0">
              <Row>
                <Col sm="4" className="px-1">
                  <h5>Name</h5>
                </Col>
                <Col sm="8" className="px-1">
                  <small>{props.deliveryOrder.name}</small>
                </Col>
              </Row>
              <Row>
                <Col sm="4" className="px-1">
                  <h5>S/D/W/o</h5>
                </Col>
                <Col sm="8" className="px-1">
                  <small>{props.deliveryOrder.customerInfo.swdo}</small>
                </Col>
              </Row>
              <Row>
                <Col sm="4" className="px-1">
                  <h5>Email</h5>
                </Col>
                <Col sm="8" className="px-1">
                  <small>{props.deliveryOrder.customerInfo.email}</small>
                </Col>
              </Row>

              <Row>
                <Col sm="4" className="px-1">
                  <h5>Present Address </h5>
                </Col>
                <Col sm="8" className="px-1">
                  <small>{props.deliveryOrder.customerInfo.currLineOne}</small>
                  <br />
                  <small>{props.deliveryOrder.customerInfo.currLineTwo}</small>
                  <br />
                  <small>{props.deliveryOrder.customerInfo.currPS}</small>
                  <br />
                  <small>
                    {props.deliveryOrder.customerInfo.currCity},{" "}
                    {props.deliveryOrder.customerInfo.currDistrict}
                  </small>
                  <br />
                  <small>
                    {props.deliveryOrder.customerInfo.currState},{" "}
                    {props.deliveryOrder.customerInfo.currPostal}
                  </small>
                </Col>
              </Row>
            </Col>

            <Col sm="6" className="p-0">
              <Row>
                <Col sm="4" className="px-1">
                  <h5>Date</h5>
                </Col>
                <Col sm="8" className="px-1">
                  <small>{new Date().toDateString()}</small>
                </Col>
              </Row>
              <Row>
                <Col sm="4" className="px-1">
                  <h5>Date of birth</h5>
                </Col>
                <Col sm="8" className="px-1">
                  <small>{props.deliveryOrder.customerInfo.dob}</small>
                </Col>
              </Row>
              <Row>
                <Col sm="4" className="px-1">
                  <h5>Phone number</h5>
                </Col>
                <Col sm="8" className="px-1">
                  <small>{props.deliveryOrder.customerInfo.phoneNo}</small>
                </Col>
              </Row>
              <Row>
                <Col sm="4" className="px-1">
                  <h5>Present Address</h5>
                </Col>
                <Col sm="8" className="px-1">
                  <small>{props.deliveryOrder.customerInfo.permLineOne}</small>
                  <br />
                  <small>{props.deliveryOrder.customerInfo.permLineTwo}</small>
                  <br />
                  <small>{props.deliveryOrder.customerInfo.permPS}</small>
                  <br />
                  <small>
                    {props.deliveryOrder.customerInfo.permCity},{" "}
                    {props.deliveryOrder.customerInfo.permDistrict}
                  </small>
                  <br />
                  <small>
                    {props.deliveryOrder.customerInfo.permState},{" "}
                    {props.deliveryOrder.customerInfo.permPostal}
                  </small>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="p-1 border border-right-0 border-left-0 border-primary w-100">
            <Col sm="6" className="p-0">
              <Row>
                <Col sm="4" className="px-1">
                  <h5 className="m-0">Model Name</h5>
                </Col>
                <Col sm="8" className="px-1">
                  <small>{props.deliveryOrder.vehicleInfo.modelName}</small>
                </Col>
              </Row>
              {props.deliveryOrder.additionalInfo.financier && (
                <Row>
                  <Col sm="4" className="px-1">
                    <h5 className="m-0">Financier</h5>
                  </Col>
                  <Col sm="8" className="px-1">
                    <small>
                      {props.deliveryOrder.additionalInfo.financier}
                    </small>
                  </Col>
                </Row>
              )}
              {props.deliveryOrder.additionalInfo.inquiryType && (
                <Row>
                  <Col sm="4" className="px-1">
                    <h5 className="m-0">Inquiry Type</h5>
                  </Col>
                  <Col sm="8" className="px-1">
                    <small>
                      {props.deliveryOrder.additionalInfo.inquiryType.toUpperCase()}
                    </small>
                  </Col>
                </Row>
              )}
              <Row>
                <Col sm="4" className="px-1">
                  <h5 className="m-0">Reference one</h5>
                </Col>
                <Col sm="8" className="px-1"></Col>
              </Row>
              <Row>
                <Col sm="4" className="px-1">
                  <h5 className="m-0">Phone number</h5>
                </Col>
                <Col sm="8" className="px-1"></Col>
              </Row>
            </Col>
            <Col sm="6" className="p-0">
              <Row>
                <Col sm="4" className="px-1">
                  <h5 className="m-0">Colour</h5>
                </Col>
                <Col sm="8" className="px-1">
                  <small>{props.deliveryOrder.vehicleInfo.color}</small>
                </Col>
              </Row>
              {props.deliveryOrder.customerInfo.gst && (
                <Row>
                  <Col sm="4" className="px-1">
                    <h5>GST</h5>
                  </Col>
                  <Col sm="8" className="px-1">
                    <small>{props.deliveryOrder.customerInfo.gst}</small>
                  </Col>
                </Row>
              )}
              <Row>
                <Col sm="4" className="px-1">
                  <h5 className="m-0">Reference two</h5>
                </Col>
                <Col sm="8" className="px-1"></Col>
              </Row>
              <Row>
                <Col sm="4" className="px-1">
                  <h5 className="m-0">Phone number</h5>
                </Col>
                <Col sm="8" className="px-1"></Col>
              </Row>
            </Col>
          </Row>
          <Table className="table table-striped table-bordered my-3">
            {props.deliveryOrder.additionalInfo.price && (
              <tr>
                <th>Price</th>
                <td>Rs. {props.deliveryOrder.additionalInfo.price}</td>
              </tr>
            )}
            {props.deliveryOrder.additionalInfo.insurance && (
              <tr>
                <th>Insurance</th>
                <td>Rs. {props.deliveryOrder.additionalInfo.insurance}</td>
              </tr>
            )}
            {props.deliveryOrder.additionalInfo.mvTax && (
              <tr>
                <th>MV Tax</th>
                <td>Rs. {props.deliveryOrder.additionalInfo.mvTax}</td>
              </tr>
            )}
            {props.deliveryOrder.additionalInfo.postalCharge && (
              <tr>
                <th>Postal Charge</th>
                <td>Rs. {props.deliveryOrder.additionalInfo.postalCharge}</td>
              </tr>
            )}
            {props.deliveryOrder.additionalInfo.extendedWarranty && (
              <tr>
                <th>
                  Extended Warranty -{" "}
                  {props.deliveryOrder.additionalInfo.extendedWarranty} years
                </th>
                <td>
                  {/*Add values to configs and then pull the value from there*/}
                </td>
              </tr>
            )}
            {props.deliveryOrder.additionalInfo.joyClub && (
              <tr>
                <th>Joy Club</th>
                <td>Rs. 412</td>
              </tr>
            )}
            {props.deliveryOrder.additionalInfo.hra && (
              <tr>
                <th>Honda Roadside Assistance</th>
                <td>Rs. 299</td>
              </tr>
            )}
            {props.deliveryOrder.additionalInfo.ptfePolish && (
              <tr>
                <th>PTFE Polish</th>
                <td>Rs. {props.deliveryOrder.additionalInfo.ptfePolish}</td>
              </tr>
            )}
            {props.deliveryOrder.additionalInfo.accessories && (
              <tr>
                <th>Accessories</th>
                <td>Rs. {props.deliveryOrder.additionalInfo.accessories}</td>
              </tr>
            )}
            <tr>
              <th>
                <strong>Total</strong>
              </th>
              <td>-</td>
            </tr>
          </Table>
          <Row
            style={{ height: "80px" }}
            className="w-100 align-items-end border border-right-0 border-left-0 border-primary"
          >
            <Col sm="6" className="px-1 text-center">
              <h5>Sales Executive Signature</h5>
            </Col>

            <Col sm="6" className="px-1 text-center">
              <h5>Customer Signature</h5>
            </Col>
          </Row>
        </Row>
      </div>
    );
  } else {
    return <></>;
  }
};

export default DeliveryOrderTable;

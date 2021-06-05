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
  };
}

type Props = {
  deliveryOrder: DeliveryOrder;
};

const DeliveryOrderTable: React.FC<Props> = (props) => {
 

  if (
    props &&
    props.deliveryOrder &&
    props.deliveryOrder.customerInfo &&
    props.deliveryOrder.vehicleInfo &&
    props.deliveryOrder.additionalInfo
  ) {
    const price= parseInt(props.deliveryOrder.additionalInfo.price)
    const insurance= parseInt(props.deliveryOrder.additionalInfo.insurance)
    const mvTax= parseInt(props.deliveryOrder.additionalInfo.mvTax)
    const postalCharge= parseInt(props.deliveryOrder.additionalInfo.postalCharge)
    const extendedWarranty= parseInt(props.deliveryOrder.additionalInfo.extendedWarranty)
    const total=[price + insurance+mvTax + postalCharge + extendedWarranty]
  
    return (
      <div className="delivery-order-table">
        <Row>
          <Row className="row-header">
            <h4 style={{ color: "white" }}>Vinayak Honda</h4>
          </Row>
          <Row className="p-1 w-100">
            <Col sm="6" className="p-0">
              <Row>
                <Col sm="4" className="px-1">
                  <h5>Name:</h5>
                </Col>
                <Col sm="8" className="px-1">
                  <small>{props.deliveryOrder.name}</small>
                </Col>
              </Row>

              <Row>
                <Col sm="4" className="px-1">
                  <h5>Present Address: </h5>
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
                  <h5>S/D/W/o:</h5>
                </Col>
                <Col sm="8" className="px-1">
                  <small>{props.deliveryOrder.customerInfo.swdo}</small>
                </Col>
              </Row>
              <Row>
                <Col sm="4" className="px-1">
                  <h5>Present Address:</h5>
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
            <Col sm="6">
              <Row>
                <Col className="p-0">
                  <h5>Ref one:</h5>
                </Col>
                <Col>-</Col>
              </Row>
              <Row>
                <Col className="p-0">
                  <h5>Phone number:</h5>
                </Col>
                <Col>-</Col>
              </Row>
            </Col>
            <Col sm="6">
              <Row>
                <Col className="p-0">
                  <h5>Ref two:</h5>
                </Col>
                <Col>-</Col>
              </Row>
              <Row>
                <Col className="p-0">
                  <h5>Phone number:</h5>
                </Col>
                <Col>-</Col>
              </Row>
            </Col>
          </Row>
          <Row className="p-1 border border-right-0 border-left-0 border-primary w-100">
            <Col sm="6">
              <Row>
                <Col className="p-0">
                  <h5>Email:</h5>
                </Col>
                <Col>{props.deliveryOrder.customerInfo.email}</Col>
              </Row>
            </Col>
            <Col sm="6">
              <Row>
                <Col className="p-0">
                  <h5>Gst:</h5>
                </Col>
                <Col>{props.deliveryOrder.customerInfo.gst}</Col>
              </Row>
            </Col>
          </Row>
          <Table className="table table-striped table-bordered ">
            <tr>
              <th>Price :</th>
              <td>{price}</td>
            </tr>
            <tr>
              <th>Insurance :</th>
              <td>{insurance}</td>
            </tr>
            <tr>
              <th>MV Tax :</th>
              <td>{mvTax}</td>
            </tr>
            <tr>
              <th>Postal Charge:</th>
              <td>{postalCharge}</td>
            </tr>
            <tr>
              <th>Extended Warranty :</th>
              <td>{extendedWarranty}</td>
            </tr>
            <tr>
              <th>Joy Club :</th>
              <td>{props.deliveryOrder.additionalInfo.joyClub}</td>
            </tr>
            <tr>
              <th>Honda Roadside Assistance :</th>
              <td>N/A</td>
            </tr>
            <tr>
              <th>PTFE Polish :</th>
              <td>N/A</td>
            </tr>
            <tr>
              <th>Total :</th>
              <td>{total}</td>
            </tr>
          </Table>
          <Col sm="6">
            <Row>
              <Col>Financer</Col>
              <Col>-</Col>
            </Row>
          </Col>
          <Col sm="6">
            <Row>
              <Col>Sales Ex.Sign</Col>
              <Col>-</Col>
            </Row>
            <Row>
              <Col>Customer Sign</Col>
              <Col>-</Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  } else {
    return <></>;
  }
};

export default DeliveryOrderTable;

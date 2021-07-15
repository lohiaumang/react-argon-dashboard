import React, { useState, useEffect } from "react";
import { Table, Row, Col } from "reactstrap";

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
  userInfo: UserInfo;
}

type Props = {
  deliveryOrder: DeliveryOrder;
};

const DeliveryOrderTable = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    if (
      props &&
      props.deliveryOrder &&
      props.deliveryOrder.customerInfo &&
      props.deliveryOrder.vehicleInfo &&
      props.deliveryOrder.additionalInfo &&
      props.deliveryOrder.userInfo
    ) {
      const price = parseInt(props.deliveryOrder.additionalInfo.price);
      const insurance = parseInt(props.deliveryOrder.additionalInfo.insurance);
      const mvTax = parseInt(props.deliveryOrder.additionalInfo.mvTax);
      const postalCharge = parseInt(
        props.deliveryOrder.additionalInfo.postalCharge
      );
      const extendedWarranty = parseInt(
        props.deliveryOrder.additionalInfo.extendedWarranty
      );
      const total = [
        price + insurance + mvTax + postalCharge + extendedWarranty,
      ];
      //create DO

      // window.api.send("fromMain", {
      //   type: "DO_CREATED",
      //   data:   props.deliveryOrder.id,
      //   // data:"INSURANCE_CREATED",
      // });

      // window.api.once("close", function () {
      //   debugger
      //   window.api.send("fromMain", {
      //     type: "DO_CREATED",
      //     data:  props.deliveryOrder.id,
      //     // data:"INSURANCE_CREATED",
      //   });
      // // });

      // window.api.send("toMain", {
      //   type: "DO_CREATED_STATUS",
      //   data: props.deliveryOrder.id
      // });

      return (
        <div className="invoice-order-table" ref={ref}>
          <Row>
            <Row className="rowHadre">
              <Col className="hader">
                <h4  className="m-0 headerName" style={{ color: "black" }}>
                  {props.deliveryOrder.userInfo.name}
                </h4>
              </Col>
              <Col className="hader">
                <p className="m-0 headerName" style={{ color: "black" }}>
                  <small>
                    <strong>Sl. no. {props.deliveryOrder.id}</strong>
                  </small>
                </p>
              </Col>
            </Row>
          </Row>
        </div>
      );
    } else {
      return <></>;
    }
  }
);

export default DeliveryOrderTable;

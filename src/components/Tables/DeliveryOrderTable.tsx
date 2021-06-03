import React, { useState, useEffect } from "react";
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
    return (
      // <div className="delviery-order-table">
      //   <Row className="mb-2">
      //     <Col>Name:</Col>
      //     <Col>{props.deliveryOrder.name}</Col>
      //   </Row>
      //   <Row className="mb-2">
      //     <Col>S/D/W/o:</Col>
      //     <Col>{props.deliveryOrder.customerInfo.swdo}</Col>
      //   </Row>
      //   <Row className="mb-2">
      //     <Col>Present Address:</Col>
      //   </Row>
      //   <Row>
      //     <Col>{props.deliveryOrder.customerInfo.currLineOne}</Col>
      //   </Row>
      //   <Row>
      //     <Col>{props.deliveryOrder.customerInfo.currLineTwo}</Col>
      //   </Row>
      //   <Row>
      //     <Col>{props.deliveryOrder.customerInfo.currPS}</Col>
      //     <Col>{props.deliveryOrder.customerInfo.currCity}</Col>
      //   </Row>
      //   <Row>
      //     <Col>{props.deliveryOrder.customerInfo.currDistrict}</Col>
      //     <Col>{props.deliveryOrder.customerInfo.currState}</Col>
      //   </Row>
      // </div>
      <Table border="1" className="delivery-order-table">
        <tr>
          <th colSpan={13}>BINAYAK HONDA</th>
        </tr>
        <tr>
          <th>Model :</th>
          <td>Activa</td>
          <th>Opt :</th>
          <td>6Gstb</td>
          <th>Color :</th>
          <td>Blue</td>
          <th>Date :</th>
          <td>17-02-21</td>
          <th>Time :</th>
          <td>9 Am</td>
          <th>Sl No :</th>
          <td>1</td>
        </tr>
        <tr>
          <th>Name :</th>
          <td colSpan={9}>Nayan Kumar</td>
          <th>Price :</th>
          <td>84000</td>
        </tr>
        <tr>
          <th>S/D/W/O :</th>
          <td colSpan={4}>Hareswer Kumar</td>
          <th>GST :</th>
          <td colSpan={4}>12365478954632146</td>
          <th>Insurance :</th>
          <td>5400</td>
        </tr>
        <tr>
          <th rowSpan={3}>Persent Address :</th>
          <td colSpan={9}>Nayan Kumar</td>
          <th>MV Tax :</th>
          <td>5428 / 5931</td>
        </tr>
        <tr>
          <td colSpan={9}>Nayan Kumar</td>
          <th>
            Postal Charge<br></br> HYPO :
          </th>
          <td>25 / 48 / 500</td>
        </tr>
        <tr>
          <td colSpan={9}>Nayan Kumar</td>
          <th>
            Extended <br></br> Warranty :
          </th>
          <td>536</td>
        </tr>
        <tr>
          <th>Locality :</th>
          <td colSpan={2}>GTB NAGAR</td>
          <th>City :</th>
          <td colSpan={2}>Delhi</td>
          <th>Pin :</th>
          <td colSpan={3}>110092</td>
          <th>Job Clube :</th>
          <td>412</td>
        </tr>
        <tr>
          <th rowSpan={2}>Permanent Address :</th>
          <td colSpan={9}>Laxmi Nager</td>
          <th>
            Honda Roadside <br></br> Assistance :
          </th>
          <td>299</td>
        </tr>
        <tr>
          <td colSpan={9}>Mandawali Budhamarge Mandaali </td>
          <th>PTFE Polish :</th>
          <td>150 500</td>
        </tr>
        <tr>
          <th>WA No :</th>
          <td colSpan={5}>88888888888</td>
          <td rowSpan={7} colSpan={4}></td>
          <th>Accessones</th>
          <td>1704</td>
        </tr>
        <tr>
          <th>Email ID :</th>
          <td colSpan={5}>N/A</td>
          <th>Total</th>
          <td>55022</td>
        </tr>
        <tr>
          <th>B day :</th>
          <td colSpan={2}>N/A</td>
          <th>Annv :</th>
          <td colSpan={2}>N/A</td>
          <th>TE | WE </th>
          <th>ERE | FRE</th>
        </tr>
        <tr>
          <th>Ref 1 :</th>
          <td colSpan={5}>Dinu da</td>
          <th colSpan={4}> Financer : HDFC</th>
        </tr>
        <tr>
          <th>WA No :</th>
          <td colSpan={5}>8888888888</td>
          <th colSpan={4}> Sales Ex.Sign : </th>
        </tr>
        <tr>
          <th>Ref 2 :</th>
          <td colSpan={5}>8888888888</td>
          <th rowSpan={2} colSpan={4}>
            {" "}
            Customer Sign :{" "}
          </th>
        </tr>
        <tr>
          <th>WA No :</th>
          <td colSpan={5}>8888888888</td>
        </tr>
        <tr>
          <th colSpan={13}>Occ : Inst:Y/N CO./Email</th>
        </tr>
      </Table>
    );
  } else {
    return <></>;
  }
};

export default DeliveryOrderTable;

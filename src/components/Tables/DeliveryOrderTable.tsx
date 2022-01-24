import React, { useState, useEffect, useContext } from "react";
import { Table, Row, Col } from "reactstrap";
import NumberFormat from "react-number-format";
import firebase from "firebase/app";
import "firebase/firestore";
import { isEmpty } from "lodash";
import { UserContext } from "../../Context";

export interface DealerInfo {
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
  createdOn: string;
  // stateInfo(stateInfo: any);
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
  initiatedBy?: string;
  salesEx: string;
  invoiceNo?: string;
  id: string;
  subDealerId?: string;
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
    category: string;
    source: string;
    sameAddress: string;
    refOne?: {
      name: string;
      phoneNo: string;
    };
    refTwo?: {
      name: string;
      phoneNo: string;
    };
  };
  vehicleInfo?: {
    color: string;
    frameNumber: string;
    engineNumber: string;
    modelName: string;
    modelCategory: string;
    hsnCode?: string;
    srNo?: string;
    batteryNO?: string;
    keyNo?: string;
  };
  stateInfo?: {
    districts: string;
  };
  additionalInfo?: {
    hra: string;
    joyClub: string;
    accessories: string;
    postalCharge: string;
    ptfePolish: string;
    price: string;
    roadTaxWithRc: string;
    extendedWarranty: string;
    insuranceDeclaredValue: string;
    inquiryType: string;
    financier?: string;
    saleType?: string;
    downPayment?: string;
    accessoriesList?: string;
    executive?: string;
    hypothecation?: string;
  };
  dealerInfo: DealerInfo;
}

type Props = {
  deliveryOrder: DeliveryOrder;
};
const DeliveryOrderTable = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const {
      deliveryOrder: {
        customerInfo,
        vehicleInfo,
        additionalInfo,
        dealerInfo,
      } = {},
      deliveryOrder,
    } = props;

    if (
      deliveryOrder &&
      customerInfo &&
      vehicleInfo &&
      additionalInfo &&
      dealerInfo
    ) {
      const [otherConfig, setOtherConfig] = useState<any>();
      const price = parseInt(additionalInfo.price || "0");
      const insurance = parseInt(additionalInfo.insuranceDeclaredValue || "0");
      const mvTax = parseInt(additionalInfo.roadTaxWithRc || "0");
      const postalCharge = parseInt(additionalInfo.postalCharge || "0");
      const accessories = parseInt(additionalInfo.accessories || "0");
      const joyClub =
        additionalInfo.joyClub === "true" && otherConfig
          ? parseInt(otherConfig["joyClub"])
          : 0;
      const hra =
        additionalInfo.hra === "true" && otherConfig
          ? parseInt(otherConfig["roadsideAssistance"])
          : 0;
      const extendedWarranty = otherConfig
        ? parseInt(otherConfig[additionalInfo.extendedWarranty] || "0")
        : 0;
      const ptfe = parseInt(additionalInfo.ptfePolish || "0");
      let total =
        price +
        insurance +
        mvTax +
        postalCharge +
        accessories +
        joyClub +
        hra +
        extendedWarranty +
        ptfe;
      let refOne: any = customerInfo.refOne || {};
      let refTwo: any = customerInfo.refTwo || {};
      let accessoriesList: any = additionalInfo.accessoriesList;
      const [user] = useContext(UserContext);

      useEffect(() => {
        const dealerId = user.createdBy || user.uid || "";
        const docRef = firebase
          .firestore()
          .collection("joyHondaConfig")
          .doc(dealerId);
        docRef.get().then((doc) => {
          if (doc.exists) {
            let otherPriceDetails: any = doc.data();
            setOtherConfig(otherPriceDetails[deliveryOrder.modelName]);
          }
        });
      }, []);

      return (
        <div className="delivery-order-table" ref={ref}>
          <Row>
            <Row className="row-header">
              <Col>
                <h4 className="m-0" style={{ color: "white" }}>
                  {dealerInfo.name}
                </h4>
              </Col>
              <Col className="text-right">
                <p className="m-0" style={{ color: "white" }}>
                  <small>
                    <strong>Sl. no. {deliveryOrder.id}</strong>
                  </small>
                </p>
              </Col>
            </Row>
            <Row className="p-1 w-100">
              <Col xs="6" className="p-0">
                <Row>
                  <Col xs="4" className="px-1">
                    <h5>Name</h5>
                  </Col>
                  <Col xs="8" className="px-1">
                    <small>{deliveryOrder.name}</small>
                  </Col>
                </Row>
                <Row>
                  <Col xs="4" className="px-1">
                    <h5>S/D/W/o</h5>
                  </Col>
                  <Col xs="8" className="px-1">
                    <small>{customerInfo.swdo}</small>
                  </Col>
                </Row>
                <Row>
                  <Col xs="4" className="px-1">
                    <h5>Email</h5>
                  </Col>
                  <Col xs="8" className="px-1">
                    <small>{customerInfo.email}</small>
                  </Col>
                </Row>

                <Row>
                  <Col xs="4" className="px-1">
                    <h5>Present Address </h5>
                  </Col>
                  <Col xs="8" className="px-1">
                    <small>{customerInfo.currLineOne}</small>
                    <br />
                    <small>{customerInfo.currLineTwo}</small>
                    <br />
                    <small>{customerInfo.currPS}</small>
                    <br />
                    <small>
                      {customerInfo.currCity}, {customerInfo.currDistrict}
                    </small>
                    <br />
                    <small>
                      {customerInfo.currState}, {customerInfo.currPostal}
                    </small>
                  </Col>
                </Row>
              </Col>

              <Col xs="6" className="p-0">
                <Row>
                  <Col xs="4" className="px-1">
                    <h5>Date</h5>
                  </Col>
                  <Col xs="8" className="px-1">
                    <small>{new Date().toDateString()}</small>
                  </Col>
                </Row>
                <Row>
                  <Col xs="4" className="px-1">
                    <h5>Date of birth</h5>
                  </Col>
                  <Col xs="8" className="px-1">
                    <small>{customerInfo.dob}</small>
                  </Col>
                </Row>
                <Row>
                  <Col xs="4" className="px-1">
                    <h5>Phone number</h5>
                  </Col>
                  <Col xs="8" className="px-1">
                    <small>{customerInfo.phoneNo}</small>
                  </Col>
                </Row>
                <Row>
                  <Col xs="4" className="px-1">
                    <h5>Permanent Address</h5>
                  </Col>
                  <Col xs="8" className="px-1">
                    <small>{customerInfo.permLineOne}</small>
                    <br />
                    <small>{customerInfo.permLineTwo}</small>
                    <br />
                    <small>{customerInfo.permPS}</small>
                    <br />
                    <small>
                      {customerInfo.permCity}, {customerInfo.permDistrict}
                    </small>
                    <br />
                    <small>
                      {customerInfo.permState}, {customerInfo.permPostal}
                    </small>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="p-1 border border-right-0 border-left-0 border-primary w-100">
              <Col xs="6" className="p-0">
                {vehicleInfo.modelName && (
                  <Row>
                    <Col xs="4" className="px-1">
                      <h5 className="m-0">Model Name</h5>
                    </Col>
                    <Col xs="8" className="px-1">
                      <small>{vehicleInfo.modelName}</small>
                    </Col>
                  </Row>
                )}
                {additionalInfo.financier && (
                  <Row>
                    <Col xs="4" className="px-1">
                      <h5 className="m-0">Financier</h5>
                    </Col>
                    <Col xs="8" className="px-1">
                      <small>{additionalInfo.financier}</small>
                    </Col>
                  </Row>
                )}
                {additionalInfo.inquiryType && (
                  <Row>
                    <Col xs="4" className="px-1">
                      <h5 className="m-0">Inquiry Type</h5>
                    </Col>
                    <Col xs="8" className="px-1">
                      <small>{additionalInfo.inquiryType.toUpperCase()}</small>
                    </Col>
                  </Row>
                )}
                {!isEmpty(refOne) && (
                  <>
                    <Row>
                      <Col xs="4" className="px-1">
                        <h5 className="m-0">Reference #1</h5>
                      </Col>
                      <Col xs="8" className="px-1">
                        <small>{refOne.name}</small>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="4" className="px-1">
                        <h5 className="m-0">Phone number</h5>
                      </Col>
                      <Col xs="8" className="px-1">
                        <small>{refOne.phoneNo}</small>
                      </Col>
                    </Row>
                  </>
                )}
              </Col>
              <Col xs="6" className="p-0">
                <Row>
                  <Col xs="4" className="px-1">
                    <h5 className="m-0">Colour</h5>
                  </Col>
                  <Col xs="8" className="px-1">
                    <small>{vehicleInfo.color}</small>
                  </Col>
                </Row>
                {customerInfo.gst && (
                  <Row>
                    <Col xs="4" className="px-1">
                      <h5>GST</h5>
                    </Col>
                    <Col xs="8" className="px-1">
                      <small>{customerInfo.gst}</small>
                    </Col>
                  </Row>
                )}
                {!isEmpty(refTwo) && (
                  <>
                    <Row>
                      <Col xs="4" className="px-1">
                        <h5 className="m-0">Reference #2</h5>
                      </Col>
                      <Col xs="8" className="px-1">
                        <small>{refTwo.name}</small>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="4" className="px-1">
                        <h5 className="m-0">Phone number</h5>
                      </Col>
                      <Col xs="8" className="px-1">
                        <small>{refTwo.phoneNo}</small>
                      </Col>
                    </Row>
                  </>
                )}
                {/* Add Sales executive name */}
                {deliveryOrder.salesEx && (
                  <Row>
                    <Col xs="4" className="px-1">
                      <h5>Sales Executive</h5>
                    </Col>
                    <Col xs="8" className="px-1">
                      <small>{deliveryOrder.salesEx}</small>
                    </Col>
                  </Row>
                )}
                {/* add downpayment */}
                {additionalInfo.downPayment && (
                  <Row>
                    <Col xs="4" className="px-1">
                      <h5>Down Payment</h5>
                    </Col>
                    <Col xs="8" className="px-1">
                      <small>{additionalInfo.downPayment}</small>
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
            <Table className="table table-striped table-bordered my-3">
              <tbody>
                {additionalInfo.price && (
                  <tr>
                    <th>Price</th>
                    <td>
                      <b>
                        <NumberFormat
                          value={additionalInfo.price}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"₹"}
                        />
                      </b>
                    </td>
                  </tr>
                )}
                {additionalInfo.insuranceDeclaredValue && (
                  <tr>
                    <th>Insurance</th>
                    <td>
                      <b>
                        <NumberFormat
                          value={additionalInfo.insuranceDeclaredValue}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"₹"}
                        />
                      </b>
                    </td>
                  </tr>
                )}
                {additionalInfo.roadTaxWithRc && (
                  <tr>
                    <th>MV Tax</th>
                    <td>
                      <b>
                        <NumberFormat
                          value={additionalInfo.roadTaxWithRc}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"₹"}
                        />
                      </b>
                    </td>
                  </tr>
                )}
                {additionalInfo.postalCharge && (
                  <tr>
                    <th>Postal Charge</th>
                    <td>
                      <b>
                        <NumberFormat
                          value={additionalInfo.postalCharge}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"₹"}
                        />
                      </b>
                    </td>
                  </tr>
                )}
                {!!extendedWarranty && (
                  <tr>
                    <th>
                      Extended Warranty -{" "}
                      {additionalInfo.extendedWarranty.includes("Four")
                        ? "4"
                        : "6"}{" "}
                      years
                    </th>
                    <td>
                      <b>
                        <NumberFormat
                          value={extendedWarranty}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"₹"}
                        />
                      </b>
                    </td>
                  </tr>
                )}
                {!!joyClub && (
                  <tr>
                    <th>Joy Club</th>
                    <td>
                      <b>
                        <NumberFormat
                          value={joyClub}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"₹"}
                        />
                      </b>
                    </td>
                  </tr>
                )}
                {!!hra && (
                  <tr>
                    <th>Honda Roadside Assistance</th>
                    <td>
                      <b>
                        <NumberFormat
                          value={hra}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"₹"}
                        />
                      </b>
                    </td>
                  </tr>
                )}
                {!!ptfe && (
                  <tr>
                    <th>PTFE Polish</th>
                    <td>
                      <b>
                        <NumberFormat
                          value={ptfe}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"₹"}
                        />
                      </b>
                    </td>
                  </tr>
                )}
                {accessoriesList && (
                  <>
                    <tr>
                      <th>Accessories</th>
                      <td>
                        <b>
                          <NumberFormat
                            value={additionalInfo.accessories}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"₹"}
                          />
                        </b>
                      </td>
                    </tr>
                    {Object.keys(accessoriesList).map((accessory: any) => (
                      <tr>
                        <td className="pl-4">{accessory}</td>
                        <td>
                          <NumberFormat
                            value={accessoriesList[accessory]}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"₹"}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                )}
                <tr>
                  <th>
                    <strong>Grand total</strong>
                  </th>
                  <td>
                    <b>
                      <NumberFormat
                        value={total}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"₹"}
                      />
                    </b>
                  </td>
                </tr>
              </tbody>
            </Table>
            <Row
              style={{ height: "80px" }}
              className="w-100 align-items-end border border-right-0 border-left-0 border-primary"
            >
              <Col xs="6" className="px-1 text-center">
                <h5>Sales Executive Signature</h5>
              </Col>
              <Col xs="6" className="px-1 text-center">
                <h5>Customer Signature</h5>
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

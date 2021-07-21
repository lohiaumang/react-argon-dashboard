import React, { useState, useEffect } from "react";
import { Table, Row, Col } from "reactstrap";
import { DeliveryOrder, UserInfo } from "./DeliveryOrderTable";
const converter = require("number-to-words");

type Props = {
  deliveryOrder: DeliveryOrder;
};

const InvoiceTable = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  if (
    props &&
    props.deliveryOrder &&
    props.deliveryOrder.customerInfo &&
    props.deliveryOrder.vehicleInfo &&
    props.deliveryOrder.additionalInfo &&
    props.deliveryOrder.userInfo
  ) {
    const handlingLogisticsCharge = converter.toWords(1920);
    // const price: Number = new Number(props.deliveryOrder.additionalInfo.price);
    const price = parseInt(props.deliveryOrder.additionalInfo.price);
    const CGST: number = Math.round(price * 0.14);
    const SGST: number = Math.round(price * 0.14);
    const totalPrice = Math.round(CGST + SGST + price);
    const totalPriceInword = converter.toWords(totalPrice);
    const grandTotalPriceInword = converter.toWords(totalPrice + 1920);

    let invoiceDate = new Date()
      .toJSON()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("/");

    return (
      <div className="delivery-order-table" ref={ref}>
        <Row>
          <Row className="row-header">
            {/* <Col>
                <h4 className="m-0" style={{ color: "white" }}>
                  {props.deliveryOrder.userInfo.name}
                </h4>
              </Col> */}
            <Col className="text-right">
              <p className="m-0" style={{ color: "white" }}>
                <small>
                  <strong>Sl. no. {props.deliveryOrder.id}</strong>
                </small>
              </p>
            </Col>
          </Row>
          <Row className="p-1 w-100">
            <Col xs="6" className="p-0">
              <Row>
                <h3>Dealer</h3>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>Name</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.userInfo.name}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>Phone number</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.userInfo.phoneNumber}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>Email</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.userInfo.email}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>GST NO</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.userInfo.gst}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>PAN</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.userInfo.pan}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>CIN</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>TODO</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>TC NO</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>TODO</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>Address</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.userInfo.address}</small>
                </Col>
              </Row>
            </Col>

            <Col xs="6" className="p-0">
              <Row>
                <h3>Buyer</h3>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>Name</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.name}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>Phone number</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.customerInfo.phoneNo}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>Email</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.customerInfo.email}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>GST NO</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.customerInfo.gst}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>PAN</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>TODO</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>CIN</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>TODO</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>UIN</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>TODO</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>Ref 1</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>TODO</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5>Ref 2</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>TODO</small>
                </Col>
              </Row>

              <Row>
                <Col xs="4" className="px-1">
                  <h5>Present Address </h5>
                </Col>
                <Col xs="8" className="px-1">
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
          </Row>
          <Row className="p-1 border border-right-0 border-left-0 border-primary w-100">
            <Col xs="6" className="p-0">
              <Row>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">Invoice No</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>123456789 TODO</small>
                </Col>
              </Row>

              <Row>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">Invoice Date</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{invoiceDate}</small>
                </Col>
              </Row>

              {props.deliveryOrder.additionalInfo.inquiryType && (
                <Row>
                  <Col xs="4" className="px-1">
                    <h5 className="m-0">Inquiry Type</h5>
                  </Col>
                  <Col xs="8" className="px-1">
                    <small>
                      {props.deliveryOrder.additionalInfo.inquiryType.toUpperCase()}
                    </small>
                  </Col>
                </Row>
              )}
              <Row>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">Salesman</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>TODO</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">Mobile No</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>TODO</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">State of supply</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>Assam</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">State code</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>AS</small>
                </Col>
              </Row>
            </Col>
            <Col xs="6" className="p-0">
              <Row>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">Booking No</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>TODO</small>
                </Col>
              </Row>

              <Row>
                <Col xs="4" className="px-1">
                  <h5>Battery No</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>TODO</small>
                </Col>
              </Row>

              <Row>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">Key No</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>TODO</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">Purchase Type</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>
                    {props.deliveryOrder.additionalInfo.financier
                      ? "FINANCE"
                      : "CASH"}
                  </small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">Hypothecation</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.additionalInfo.financier}</small>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="p-1 border border-right-0 border-left-0 border-primary w-100">
            <Col xs="6" className="p-0">
              <Row>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">Model Code</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.vehicleInfo.modelCategory}</small>
                </Col>
              </Row>

              <Row>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">Type/Variant</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.vehicleInfo.modelName}</small>
                </Col>
              </Row>

              <Row>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">Colour</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.vehicleInfo.color}</small>
                </Col>
              </Row>
            </Col>
            <Col xs="6" className="p-0">
              <Row>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">Frame no</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>
                    <small>{props.deliveryOrder.vehicleInfo.frameNumber}</small>
                  </small>
                </Col>
              </Row>

              <Row>
                <Col xs="4" className="px-1">
                  <h5>Engine No</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.vehicleInfo.engineNumber}</small>
                </Col>
              </Row>
            </Col>
          </Row>

          <Table className="table   my-3">
            <thead>
              <tr>
                <th>Description</th>
                <th>HSN/SAC</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>{props.deliveryOrder.vehicleInfo.modelName}</th>
                <td></td>
                <td>{props.deliveryOrder.additionalInfo.price}</td>
                <td>{props.deliveryOrder.additionalInfo.price}</td>
              </tr>
              <tr>
                <th>CGST @ 14%</th>
                <td></td>
                <td></td>
                <td>{CGST}</td>
              </tr>
              <tr>
                <th>GST @ 14%</th>
                <td></td>
                <td></td>
                <td>{SGST}</td>
              </tr>
              <tr>
                <th>Discount</th>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th>Amount in words</th>
                <td>
                  {"Rupee"} {totalPriceInword}
                </td>
                <th>Total</th>
                <td>{totalPrice}</td>
              </tr>
            </tbody>
          </Table>

          <Row className="p-1 border border-right-0 border-left-0 border-primary w-100">
            <Col xs="12" className="p-0">
              <Row>
                <Col xs="2" className="px-1">
                  <h5 className="m-0">Remarks:</h5>
                </Col>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">Customer Temp Address:</h5>
                </Col>
                <Col xs="6" className="px-1">
                  <small>
                    {props.deliveryOrder.customerInfo.currLineOne}
                    {"   "}
                    {props.deliveryOrder.customerInfo.currLineTwo}
                  </small>
                  <br />

                  <small>
                    {"PS"}
                    {"  "}
                    {props.deliveryOrder.customerInfo.currPS}
                  </small>
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
          </Row>

          <Row className="p-1 border border-right-0 border-left-0 border-primary w-100">
            <Col xs="6" className="p-0">
              <Row>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">Invoice No.</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small></small>
                </Col>
              </Row>
            </Col>
            <Col xs="6" className="p-0">
              <Row>
                <Col xs="4" className="px-1">
                  <h5 className="m-0">Invoice Date</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{invoiceDate}</small>
                </Col>
              </Row>
            </Col>
          </Row>

          <Table className="table   my-3">
            <thead>
              <tr>
                <th>Description</th>
                <th>HSN/SAC</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Handling & Logistics Charge</th>
                <td>9967</td>
                <td>1627.00</td>
                <td>1627.00</td>
              </tr>
              <tr>
                <th>CGST @ 9%</th>
                <td></td>
                <td></td>
                <td>146.43</td>
              </tr>
              <tr>
                <th>GST @ 9%</th>
                <td></td>
                <td></td>
                <td>146.43</td>
              </tr>
              <tr>
                <th>Discount</th>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th>Amount in words</th>
                <td>
                  {"Rupee"} {handlingLogisticsCharge}
                </td>
                <th>Total</th>
                <td>1,920.00</td>
              </tr>
              <tr>
                <th>Amount in words</th>
                <td>
                  {"Rupee"} {grandTotalPriceInword}
                </td>
                <th>Grand Total</th>
                <td>{totalPrice + 1920}</td>
              </tr>
            </tbody>
          </Table>

          <Row className="p-1 border border-right-0 border-left-0 border-primary w-100">
            <Col xs="12" className="p-0">
              <Row>
                <Col xs="12" className="px-1">
                  <h5 className="m-0">Declaration:</h5>
                </Col>
                <Col xs="12" className="px-1">
                  <small>
                    I/We hereby certify that my/our registration certificate
                    under the - Jurisdiction is in force on the date on which
                    the sale of goods specified in this Tax Invoice is made by
                    me/us and that the transaction of sale covered by this Tax
                    Invoice has been effected by me/us and it shall be accounted
                    for in the turnover of sales while filling of the return and
                    the due tax, if any payable on the sale has been paid or
                    shall be paid.
                  </small>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="p-1 border border-right-0 border-left-0 border-primary w-100">
            <Col xs="12" className="p-0">
              <Row>
                <Col xs="12" className="px-1 text-center">
                  <small>
                    ( Invoice / Owner's Manual / Free Service Coupon / Tool Kit
                    )
                  </small>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="p-1 border border-right-0 border-left-0 border-primary w-100">
            <Col xs="12" className="p-0">
              <Row>
                <Col xs="12" className="px-1 text-center">
                  <small>
                    Received the above mentioned vehicle complete with tools,
                    accessories & necessary documents to my satisfaction
                  </small>
                </Col>
              </Row>
            </Col>
          </Row>

          <Table className="table   my-3">
            <thead>
              <tr>
                <th>Invoice No.</th>
                <th>Invoice Date</th>
                <th>Frame No.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TODO</td>
                <td>{invoiceDate}</td>
                <td>{props.deliveryOrder.vehicleInfo.frameNumber}</td>
              </tr>
            </tbody>
          </Table>

          <Row
            style={{ height: "80px" }}
            className="w-100 align-items-end border border-right-0 border-left-0 border-primary"
          >
            <Col xs="6" className="px-1 text-center">
              <h5>Authorised Signature</h5>
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
});

export default InvoiceTable;

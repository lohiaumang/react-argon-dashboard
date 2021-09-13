import React, { useState, useEffect } from "react";
import { Table, Row, Col } from "reactstrap";
import { DeliveryOrder } from "./DeliveryOrderTable";
import NumberFormat from "react-number-format";
const converter = require("number-to-words");

type Props = {
  deliveryOrder: DeliveryOrder;
  hsnCode: any;
  invoiceNo: any;
};

const InvoiceTable = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  debugger;
  if (
    props &&
    props.deliveryOrder &&
    props.deliveryOrder.customerInfo &&
    props.deliveryOrder.vehicleInfo &&
    props.deliveryOrder.additionalInfo &&
    props.deliveryOrder.dealerInfo
  ) {
    const handlingLogisticsCharge = converter.toWords(1920);
    // const price: Number = new Number(props.deliveryOrder.additionalInfo.price);
    const price = parseInt(props.deliveryOrder.additionalInfo.price);
    const CGST: number = Math.round(price * 0.14);
    const SGST: number = Math.round(price * 0.14);
    const totalPrice = Math.round(CGST + SGST + price);
    const totalPriceInword = converter.toWords(totalPrice);
    const grandTotalPriceInword = converter.toWords(totalPrice + 1920);
    console.log(props.hsnCode, "hsncode invoice page");

    let invoiceDate = new Date()
      .toJSON()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("/");

    return (
      <div className="delivery-order-table font" ref={ref}>
        <Row>
          <Row className="row-header">
            <Col>
              <h4 className="m-0" style={{ color: "white" }}>
                {props.deliveryOrder.dealerInfo.name}
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
            <Col xs="6" className="p-0">
              <Row>
                <h3>Dealer</h3>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h6>Name</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.dealerInfo.name}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h6>Phone number</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.dealerInfo.phoneNumber}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h6>Email</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.dealerInfo.email}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h6>GST NO</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.dealerInfo.gst}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h6>PAN</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.dealerInfo.pan}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h6>TC NO</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>
                    {props.deliveryOrder.dealerInfo.temporaryCertificate}
                  </small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h6>Address</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.dealerInfo.address}</small>
                </Col>
              </Row>
            </Col>

            <Col xs="6" className="p-0">
              <Row>
                <h3>Buyer</h3>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h6>Name</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.name}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h6>Phone number</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.customerInfo.phoneNo}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h6>Email</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.customerInfo.email}</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h6>Ref 1</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small></small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h6>Ref 2</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small></small>
                </Col>
              </Row>

              <Row>
                <Col xs="4" className="px-1">
                  <h6>Present Address </h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>
                    {props.deliveryOrder.customerInfo.currLineOne},
                    {props.deliveryOrder.customerInfo.currLineTwo},
                    {props.deliveryOrder.customerInfo.currPS},
                    {props.deliveryOrder.customerInfo.currCity},
                    {props.deliveryOrder.customerInfo.currDistrict},
                    {props.deliveryOrder.customerInfo.currState},
                    {props.deliveryOrder.customerInfo.currPostal}
                  </small>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="p-1 border border-right-0 border-left-0 border-primary w-100">
            <Col xs="6" className="p-0 padding-0">
              <Row>
                <Col xs="4" className="px-1">
                  <h6 className="m-0">Invoice No</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.invoiceNo || props.deliveryOrder.invoiceNo}</small>
                </Col>
              </Row>

              <Row>
                <Col xs="4" className="px-1">
                  <h6 className="m-0">Invoice Date</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{invoiceDate}</small>
                </Col>
              </Row>

              {props.deliveryOrder.additionalInfo.inquiryType && (
                <Row>
                  <Col xs="4" className="px-1">
                    <h6 className="m-0">Inquiry Type</h6>
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
                  <h6 className="m-0">Salesman</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small></small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h6 className="m-0">Mobile No</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small></small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h6 className="m-0">State of supply</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>Assam</small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h6 className="m-0">State code</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>AS</small>
                </Col>
              </Row>
            </Col>
            <Col xs="6" className="p-0">
              <Row>
                <Col xs="4" className="px-1">
                  <h6 className="m-0">Booking No</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small></small>
                </Col>
              </Row>

              <Row>
                <Col xs="4" className="px-1">
                  <h6>Battery No</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small></small>
                </Col>
              </Row>

              <Row>
                <Col xs="4" className="px-1">
                  <h6 className="m-0">Key No</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small></small>
                </Col>
              </Row>
              <Row>
                <Col xs="4" className="px-1">
                  <h6 className="m-0">Purchase Type</h6>
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
                  <h6 className="m-0">Hypothecation</h6>
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
                  <h6 className="m-0">Model Code</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.vehicleInfo.modelCategory}</small>
                </Col>
              </Row>

              <Row>
                <Col xs="4" className="px-1">
                  <h6 className="m-0">Type/Variant</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.vehicleInfo.modelName}</small>
                </Col>
              </Row>

              <Row>
                <Col xs="4" className="px-1">
                  <h6 className="m-0">Colour</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.vehicleInfo.color}</small>
                </Col>
              </Row>
            </Col>
            <Col xs="6" className="p-0">
              <Row>
                <Col xs="4" className="px-1">
                  <h6 className="m-0">Frame no</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.vehicleInfo.frameNumber}</small>
                </Col>
              </Row>

              <Row>
                <Col xs="4" className="px-1">
                  <h6>Engine No</h6>
                </Col>
                <Col xs="8" className="px-1">
                  <small>{props.deliveryOrder.vehicleInfo.engineNumber}</small>
                </Col>
              </Row>
            </Col>
          </Row>

          <Table className="table my-3" responsive>
            <thead>
              <tr>
                <th>Description</th>
                <th>HSN/SAC</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ fontSize: "9px" }}>
                <th style={{ fontSize: "9px" }}>
                  {props.deliveryOrder.vehicleInfo.modelName}
                </th>
                <td style={{ fontSize: "9px" }}>{props.hsnCode}</td>
                <td style={{ fontSize: "9px" }}>
                  <NumberFormat
                    value={props.deliveryOrder.additionalInfo.price}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"₹"}
                  />
                </td>
                <td style={{ fontSize: "9px" }}>
                  <NumberFormat
                    value={props.deliveryOrder.additionalInfo.price}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"₹"}
                  />
                </td>
              </tr>
              <tr>
                <th style={{ fontSize: "9px" }}>CGST @ 14%</th>
                <td style={{ fontSize: "9px" }}></td>
                <td style={{ fontSize: "9px" }}></td>
                <td style={{ fontSize: "9px" }}>
                  <NumberFormat
                    value={CGST}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"₹"}
                  />
                </td>
              </tr>
              <tr>
                <th style={{ fontSize: "9px" }}>GST @ 14%</th>
                <td style={{ fontSize: "9px" }}></td>
                <td style={{ fontSize: "9px" }}></td>
                <td style={{ fontSize: "9px" }}>
                  <NumberFormat
                    value={SGST}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"₹"}
                  />
                </td>
              </tr>
              <tr>
                <th style={{ fontSize: "9px" }}>Discount</th>
                <td style={{ fontSize: "9px" }}></td>
                <td style={{ fontSize: "9px" }}></td>
                <td style={{ fontSize: "9px" }}></td>
              </tr>
              <tr>
                <th style={{ fontSize: "9px" }}>Amount in words</th>
                <td style={{ fontSize: "9px" }}>
                  {"Rupee"} {totalPriceInword}
                </td>
                <th style={{ fontSize: "9px" }}>Total</th>
                <td style={{ fontSize: "9px" }}>
                  <NumberFormat
                    value={totalPrice}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"₹"}
                  />
                </td>
              </tr>
            </tbody>
          </Table>

          <Row className="p-1 border border-right-0 border-left-0 border-primary w-100">
            <Col xs="12" className="p-0">
              <Row>
                {/* <Col xs="2" className="px-1">
                  <h5 className="m-0">Remarks:</h5>
                </Col> */}
                <Col xs="2" className="px-1">
                  <h5 className="m-0">Customer Temp Address:</h5>
                </Col>
                <Col xs="8" className="px-1">
                  <small>
                    {props.deliveryOrder.customerInfo.currLineOne},
                    {props.deliveryOrder.customerInfo.currLineTwo},
                    {props.deliveryOrder.customerInfo.currPS},
                    {props.deliveryOrder.customerInfo.currCity},
                    {props.deliveryOrder.customerInfo.currDistrict},
                    {props.deliveryOrder.customerInfo.currState},
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
                  <small>{props.invoiceNo||props.deliveryOrder.invoiceNo}</small>
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

          <Table className="table my-3" responsive>
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
                <th style={{ fontSize: "9px" }}>Handling & Logistics Charge</th>
                <td style={{ fontSize: "9px" }}>{props.hsnCode}</td>
                <td style={{ fontSize: "9px" }}>
                  <NumberFormat
                    value={1627}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"₹"}
                  />
                </td>
                <td style={{ fontSize: "9px" }}>
                  <NumberFormat
                    value={1627}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"₹"}
                  />
                </td>
              </tr>
              <tr>
                <th style={{ fontSize: "9px" }}>CGST @ 9%</th>
                <td style={{ fontSize: "9px" }}></td>
                <td style={{ fontSize: "9px" }}></td>
                <td style={{ fontSize: "9px" }}>
                  <NumberFormat
                    value={146.43}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"₹"}
                  />
                </td>
              </tr>
              <tr>
                <th style={{ fontSize: "9px" }}>GST @ 9%</th>
                <td style={{ fontSize: "9px" }}></td>
                <td style={{ fontSize: "9px" }}></td>
                <td style={{ fontSize: "9px" }}>
                  <NumberFormat
                    value={146.43}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"₹"}
                  />
                </td>
              </tr>
              <tr>
                <th style={{ fontSize: "9px" }}>Discount</th>
                <td style={{ fontSize: "9px" }}></td>
                <td style={{ fontSize: "9px" }}></td>
                <td style={{ fontSize: "9px" }}></td>
              </tr>
              <tr>
                <th style={{ fontSize: "9px" }}>Amount in words</th>
                <td style={{ fontSize: "9px" }}>
                  {"Rupee"} {handlingLogisticsCharge}
                </td>
                <th style={{ fontSize: "9px" }}>Total</th>
                <td style={{ fontSize: "9px" }}>
                  <NumberFormat
                    value={1920}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"₹"}
                  />
                </td>
              </tr>
              <tr>
                <th style={{ fontSize: "9px" }}>Amount in words</th>
                <td style={{ fontSize: "9px" }}>
                  {"Rupee"} {grandTotalPriceInword}
                </td>
                <th style={{ fontSize: "9px" }}>Grand Total</th>
                <td style={{ fontSize: "9px" }}>
                  <NumberFormat
                    value={totalPrice + 1920}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"₹"}
                  />
                </td>
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
                <th style={{ fontSize: "9px" }}>Invoice No.</th>
                <th style={{ fontSize: "9px" }}>Invoice Date</th>
                <th style={{ fontSize: "9px" }}>Frame No.</th>hsnCode
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontSize: "9px" }}>{props.invoiceNo||props.deliveryOrder.invoiceNo}</td>
                <td style={{ fontSize: "9px" }}>{invoiceDate}</td>
                <td style={{ fontSize: "9px" }}>
                  {props.deliveryOrder.vehicleInfo.frameNumber}
                </td>
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

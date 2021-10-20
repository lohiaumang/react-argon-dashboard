import React from "react";
import { Table, Button } from "reactstrap";

type Props = {
  modelWiseData: any;
};

const ModelWiseDelevery = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    if (props && props.modelWiseData) {
      let modelData: any;
      modelData = props.modelWiseData;

      return (
        <div className="delivery-order-table" ref={ref}>
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th style={{ width: "40%" }} scope="col">
                  Model Name
                </th>
                <th style={{ width: "40%" }} scope="col">
                  Total Sale
                </th>
                <th style={{ width: "40%" }} scope="col">
                  Total Sale Value
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(modelData).map((modelWiseData: string, index) => {
                let saleValue = new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(modelData[modelWiseData].totalSaleValue);
                return (
                  <tr key={index}>
                    <th scope="row">{modelWiseData}</th>
                    <td>{modelData[modelWiseData].totalSaleNo}</td>
                    <td>{saleValue}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      );
    } else {
      return <></>;
    }
  }
);

export default ModelWiseDelevery;

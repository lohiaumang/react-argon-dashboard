import React from "react";
import { Table, Button } from "reactstrap";

type Props = {
  modelWiseData: any;
};

const ModelWiseDelevery = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    if (props && props.modelWiseData) {
      let modelData: any;
      modelData = props.modelWiseData
      

      return (
        <div className="delivery-order-table" ref={ref}>
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th scope="col">Model Name</th>
                <th scope="col">Total Sale</th>
                <th scope="col">Total Sale Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(modelData).map((modelWiseData: string, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{modelWiseData}</th>
                    <td>{modelData[modelWiseData].totalSaleNo}</td>
                    <td>{modelData[modelWiseData].totalSaleValue}</td>
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

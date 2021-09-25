import React from "react";
import { Table, Button } from "reactstrap";

type Props = {
  weekWiseData: any;
};

const WeekWiseDelevery = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    if (props && props.weekWiseData) {
      let weekData: any = [];
      weekData = props.weekWiseData
      

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
              {Object.keys(props.weekWiseData).map((modelName: string, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{modelName}</th>
                    <td>{props.weekWiseData[modelName].totalSaleNo}</td>
                    <td>{props.weekWiseData[modelName].totalSaleValue}</td>
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

export default WeekWiseDelevery;

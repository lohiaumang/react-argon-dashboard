import React, { } from "react";
import { Table, Button } from "reactstrap";

type Props = {
  monthWiseDeliveryOrder: any;
};

const MonthWiseDelevery = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    if (props && props.monthWiseDeliveryOrder) {
      let monthData;
      monthData = props.monthWiseDeliveryOrder

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
              {Object.keys(props.monthWiseDeliveryOrder).map((modelName: string, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{modelName}</th>
                    <td>{props.monthWiseDeliveryOrder[modelName].totalSaleNo}</td>
                    <td>{props.monthWiseDeliveryOrder[modelName].totalSaleValue}</td>
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

export default MonthWiseDelevery;

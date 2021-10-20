import React from "react";
import { Table, Button } from "reactstrap";

type Props = {
  weekWiseData: any;
};

const WeekWiseDelevery = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    if (props && props.weekWiseData) {
      let weekData: any;
      weekData = props.weekWiseData;

      return (
        <div className="delivery-order-table" ref={ref}>
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th style={{ width: "40%" }} scope="col">
                  Week Number
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
              {Object.keys(weekData).map((currWeekData: string, index) => {
                let saleValue = new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(weekData[currWeekData].totalSaleValue);
                return (
                  <tr key={index}>
                    <th scope="row">{currWeekData}</th>
                    <td>{weekData[currWeekData].totalSaleNo}</td>
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

export default WeekWiseDelevery;

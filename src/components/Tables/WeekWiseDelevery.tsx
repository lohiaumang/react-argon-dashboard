import React from "react";
import { Table, Button } from "reactstrap";

type Props = {
  weekWiseData: any;
};

const WeekWiseDelevery = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    if (props && props.weekWiseData) {
      let weekData: any;
      weekData = props.weekWiseData
      

      return (
        <div className="delivery-order-table" ref={ref}>
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th scope="col">Week Number</th>
                <th scope="col">Total Sale</th>
                <th scope="col">Total Sale Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(weekData).map((currWeekData: string, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{currWeekData}</th>
                    <td>{weekData[currWeekData].totalSaleNo}</td>
                    <td>{weekData[currWeekData].totalSaleValue}</td>
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

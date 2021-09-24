import React from "react";
import { Table, Button } from "reactstrap";

type Props = {
  weekWiseData: any;
};

const WeekWiseDelevery = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    if (props && props.weekWiseData) {
      let weekData=[];
      weekData=props.weekWiseData

      console.log(props.weekWiseData, "get prop data");
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
              {Object.keys(props.weekWiseData).map((curElem: any,i) => {
                return (
                  <tr key={curElem}>
                    <th scope="row">{curElem}</th>
                    <td>{curElem.totalsaleNo}</td>
                    <td>{curElem.color}</td>
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

import React from "react";
import { Table, Button } from "reactstrap";

type Props = {
  weekWiseDeliveryOrder: any;
};

const WeekWiseDelevery = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    if (props && props.weekWiseDeliveryOrder) {
      return (
        <div className="delivery-order-table" ref={ref}>
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Model Name</th>
                <th scope="col">Color</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {props.weekWiseDeliveryOrder.map((curElem: any) => {
                return (
                  <tr key={curElem.id}>
                    <th scope="row">{curElem.name}</th>
                    <td>{curElem.modelName}</td>
                    <td>{curElem.color}</td>
                    <td className="text-right">
                      <Button
                        className="small-button-width"
                        color="danger"
                        size="sm"
                        //onClick={() => deleteUser(curElem.id)}
                      >
                        {/* {Deleteloading ? <Loading /> : "Delete"} */}
                        Delete
                      </Button>
                    </td>
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

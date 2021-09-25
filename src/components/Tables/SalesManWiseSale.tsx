import React from "react";
import { Table, Button } from "reactstrap";

type Props = {
    salesManWise: any;
};

const SalesManWiseSale = React.forwardRef<HTMLDivElement, Props>(
    (props, ref) => {
        if (props && props.salesManWise) {
            debugger;
            let salesManWise: any = [];
            salesManWise = props.salesManWise


            return (
                <div className="delivery-order-table" ref={ref}>
                    <Table className="align-items-center table-flush" responsive>
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Sales Man Name</th>
                                <th scope="col">Model Name</th>
                                <th scope="col">Total Sale</th>
                                <th scope="col">Total Sale Value</th>
                            </tr>
                        </thead>

                        <tbody>
                            {Object.keys(salesManWise).map((salesManName: string, index) => {
                                let modelName: any = Object.keys(props.salesManWise[salesManName])
                                return (
                                    <>
                                        {!!modelName.length &&
                                            modelName.map((item: any, index: any) => (
                                                <tr key={index}>
                                                    {!!index ? (
                                                        <th></th>
                                                    ) : (
                                                        <th scope="row">{salesManName}</th>
                                                    )}
                                                    <td>{item}</td>
                                                    <td>{salesManWise[salesManName][item].totalSaleNo}</td>
                                                    <td>{salesManWise[salesManName][item].totalSaleValue}</td>
                                                </tr>
                                            ))}
                                    </>
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

export default SalesManWiseSale;

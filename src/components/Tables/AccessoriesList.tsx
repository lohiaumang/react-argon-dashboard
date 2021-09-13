import React, { useState, useEffect, useContext } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
//import "./AccessoriesList.css";
import { Input, Label, Table } from "reactstrap";

export interface AccessoriesListProps {
  //isOpen: boolean;
  modelName: string;
  accessories: {
    total: number;
    accessoriesList: {
      [key: string]: string;
    };
  };
  checked: {
    [key: string]: boolean;
  };
  additionalId: string;
  onChange: (accessories: any) => void;
}
const AccessoriesList: React.FC<AccessoriesListProps> = (props) => {
  // const { modelName, accessories, checked, onChange } = props;
  // const [accessories, setAccessories] = useState<any>();
  // const [checked, setChecked] = useState<any>();
  // const [total, setTotal] = useState<number>(0);
  let fetched = false;

  // useEffect(() => {
  //   if (!fetched && modelName) {
  //     firebase
  //       .firestore()
  //       .collection("accessories")
  //       .get()
  //       .then((querySnapshot) => {
  //         const [accessoriesConfig = {}, accessoriesMap = {}] =
  //           querySnapshot.docs.map((doc) => doc.data());
  //         const accessories = accessoriesConfig[accessoriesMap[modelName]];
  //         setAccessories(accessories);
  //       });
  //     fetched = true;
  //   }
  // }, [modelName]);
  //console.log(accessories);

  // useEffect(() => {
  //   let tempChecked: any = {};
  //   if (accessories) {
  //     for (let accessory in accessories) {
  //       tempChecked[accessory] = false;
  //     }

  //     if (
  //       initialAccessories &&
  //       initialAccessories.total &&
  //       initialAccessories.accessoriesList
  //     ) {
  //       for (let accessory in initialAccessories.accessoriesList) {
  //         tempChecked[accessory] = true;
  //       }
  //     }
  //   }

  //   setTotal(initialAccessories.total || 0);
  //   setChecked(tempChecked);
  // }, [accessories, initialAccessories]);

  // useEffect(() => {
  //   if (total) {
  //     firebase
  //       .firestore()
  //       .collection("additionals")
  //       .doc(props.additionalId)
  //       .set(
  //         {
  //           accessories: total,
  //           // status: "PENDING",
  //         },
  //         { merge: true }
  //       );
  //   }
  // }, [total]);

  // useEffect(() => {
  //   if (total && checked) {
  //     onChange({ total, accessoriesList: getAccessories() });
  //   }
  // }, [checked, total]);

  // const getAccessories = () => {
  //   let acc: any = {};

  //   for (let accessory in accessories) {
  //     if (checked[accessory]) {
  //       acc = {
  //         ...acc,
  //         [accessory]: accessories[accessory],
  //       };
  //     }
  //   }

  //   return acc;
  // };

  return (
    // <ListGroup>
    //   {accessories &&
    //     Object.keys(accessories).map((accessory) => (
    //       <ListGroupItem key={accessory}>
    //         <Label>
    //           <div>
    //             <h6>{accessory}</h6>
    //             <h6>Rs. {accessories[accessory]}</h6>
    //           </div>
    //         </Label>
    //         <Input
    //           className="checkbox"
    //           checked={checked ? checked[accessory] : false}
    //           onChange={(e: any) => {
    //             let tempChecked: any = checked || {};
    //             tempChecked[accessory] = !tempChecked[accessory];
    //             setChecked(tempChecked);
    //             if (tempChecked[accessory]) {
    //               setTotal(total + parseInt(accessories[accessory]));
    //             } else {
    //               setTotal(total - parseInt(accessories[accessory]));
    //             }
    //           }}
    //           type="checkbox"
    //         />
    //       </ListGroupItem>
    //     ))}
    //   <Label>
    //     <div className="accessories-total">
    //       <b>Total</b>
    //       <b>Rs. {total}</b>
    //     </div>
    //   </Label>
    // </ListGroup>
    // <>
    //   <Table className="table table-striped table-bordered my-3">
    //     <thead className="thead-light">
    //       <tr>
    //         <th scope="col" className="text-center">
    //           Select
    //         </th>
    //         <th scope="col">Name</th>
    //         <th scope="col">Price</th>

    //         {/* <th scope="col">Status</th> */}
    //         {/* <th scope="col">Action</th> */}
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {accessories &&
    //         Object.keys(accessories).map((accessory) => (
    //           <tr key={accessory}>
    //             <td scope="row" className="text-center">
    //               <Input
    //                 className="checkbox"
    //                 checked={checked ? checked[accessory] : false}
    //                 onChange={(e: any) => {
    //                   let tempChecked: any = checked || {};
    //                   tempChecked[accessory] = !tempChecked[accessory];
    //                   setChecked(tempChecked);
    //                   if (tempChecked[accessory]) {
    //                     setTotal(total + parseInt(accessories[accessory]));
    //                   } else {
    //                     setTotal(total - parseInt(accessories[accessory]));
    //                   }
    //                 }}
    //                 type="checkbox"
    //               />
    //             </td>
    //             <td>{accessory}</td>
    //             <td>{accessories[accessory]}</td>
    //             {/* {/* <td>{total}</td> */}
    //           </tr>
    //         ))}
    //       <tr>
    //         <td></td>
    //         <td>
    //           <b>Total </b>
    //         </td>
    //         <td>
    //           <b>{total}</b>
    //         </td>
    //       </tr>
    //     </tbody>
    //   </Table>
    // </>
    <></>
  );
};
export default AccessoriesList;

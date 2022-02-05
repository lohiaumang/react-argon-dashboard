import React, { useState, useEffect, useContext } from "react";
// reactstrap components
import { CardBody, Row, Col, FormGroup, CustomInput, Label } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
//core components

import Loading from "../../components/Share/Loading";
import * as XLSX from "xlsx";

import { UserContext } from "../../Context";
import firebase from "firebase/app";
import "firebase/firestore";
import { useCancellablePromise } from "../../hooks/useCancellablePromise";

const InventoryTable: React.FC = () => {
  const [user]: any = useContext(UserContext);
  const [inventory, setinventory] = useState({});
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const db = firebase.firestore();
  const { cancellablePromise } = useCancellablePromise();
  const dealerId = user.createdBy || user.uid || "";
  let collectonName = "inv" + "-" + dealerId;
  useEffect(() => {
    if (user && (user.createdBy || user.uid)) {
      setLoadingPage(true);

      cancellablePromise(db.collection(collectonName).get()).then(
        (querySnapshot: any) => {
          let inventory: any = {};
          querySnapshot.docs.forEach((doc: any) => {
            inventory[doc.id] = {
              ...doc.data(),
              id: doc.id,
            };
          });
          setinventory(inventory);
          setLoadingPage(false);
        }
      );
    }

    return () => {
      window.api.clear();
    };
  }, []);

  const readExcel = async (file: any) => {
    setLoadingPage(true);
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e: any) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then(async (data: any) => {
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        let frameNo: any;
        frameNo = data[i]["Frame #"];
        db.collection(collectonName).doc(frameNo).set(
          {
            frameNo: data[i]["Frame #"],
            color: data[i]["Color"],
            engineNo: data[i]["Engine No"],
            hsmiInvoiceAmount: data[i]["HMSI Invoice Amount"],
            hSNCode: data[i]["HSN Code"],
            modelCategory: data[i]["Model Category"],
            modelCode: data[i]["Model Code"],
            modelVariant: data[i]["Model Variant"],
          },
          { merge: true }
        );
      }

      setLoadingPage(false);
    });
  };

  const rows = Object.values(inventory).map((currElem: any) => {
    const { frameNo, engineNo, color, modelVariant, modelCode } = currElem;

    return {
      frameNo,
      engineNo,
      color,
      modelVariant,
      modelCode,
    };
  });
  return (
    <>
      <Row>
        <Col xs="8">
          <h6 className="heading-small text-muted my-2">Inventory Table</h6>
        </Col>
        <div>
          {loadingPage ? (
            <>
              <div className="w-100 my-4 d-flex justify-content-center">
                <Loading />
              </div>
            </>
          ) : (
            <div style={{ padding: "7px" }}>
              {Object.values(inventory).length > 0 ? (
                <BootstrapTable
                  data={rows}
                  striped
                  hover
                  keyField="frameNo"
                  pagination
                  search={true}
                >
                  <TableHeaderColumn dataSort={true} dataField="frameNo">
                    Frame No
                  </TableHeaderColumn>
                  <TableHeaderColumn dataSort={true} dataField="engineNo">
                    Engine No
                  </TableHeaderColumn>
                  <TableHeaderColumn dataSort={true} dataField="color">
                    Color
                  </TableHeaderColumn>
                  <TableHeaderColumn dataSort={true} dataField="modelVariant">
                    Model Name
                  </TableHeaderColumn>
                  <TableHeaderColumn dataSort={true} dataField="modelCode">
                    Model Code
                  </TableHeaderColumn>
                </BootstrapTable>
              ) : (
                <CardBody className="p-4">You are all done!</CardBody>
              )}
            </div>
          )}

          <Row>
            <Col sm={{ size: 6, offset: 3 }} className="text-center">
              <FormGroup>
                <Label for="formatFile">Bulk upload config</Label>
                <CustomInput
                  type="file"
                  id="formatFile"
                  name="formatFile"
                  label="Choose file"
                  onChange={(e: any) => {
                    const file = e.target.files[0];
                    readExcel(file);
                  }}
                />
              </FormGroup>
              {/* {bulkUploadError && (
              <small className="text-danger">{bulkUploadError}</small>
            )} */}
            </Col>
          </Row>
        </div>
      </Row>
    </>
  );
};

export default InventoryTable;

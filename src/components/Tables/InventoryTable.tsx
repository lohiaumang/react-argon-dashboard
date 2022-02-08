import React, { useState, useEffect, useContext } from "react";
// reactstrap components
import {
  CardBody,
  Row,
  Col,
  FormGroup,
  CustomInput,
  Label,
  Form,
  Button,
  Collapse,
} from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import Loading from "../Share/Loading";
import firebase from "firebase/app";
import "firebase/firestore";
import * as XLSX from "xlsx";
import { UserContext } from "../../Context";
import { useCancellablePromise } from "../../hooks/useCancellablePromise";

const InventoryTable: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [user]: any = useContext(UserContext);
  const [inventory, setinventory] = useState({});
  const db = firebase.firestore();
  const { cancellablePromise } = useCancellablePromise();
  const dealerId = user.createdBy || user.uid || "";
  let collectonName = "inv" + "-" + dealerId;

  useEffect(() => {
    if (user && (user.createdBy || user.uid)) {
      setLoading(true);

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
          setLoading(false);
        }
      );
    }

    return () => {
      window.api.clear();
    };
  }, []);

  const readExcel = async (file: any) => {
    setLoading(true);
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
      debugger;
      for (let i = 0; i < data.length; i++) {
        let frameNumber: any;
        frameNumber = data[i]["Frame #"];
        //let price: any = data[i]["HMSI Invoice Amount"];
        let price = data[i]["HMSI Invoice Amount"].replace("Rs.", "") || "";
        // price = data[i]["HMSI Invoice Amount"].split("Rs.");
        price = parseFloat(price.replace(/,/g, ""));
        //price = price.split("Rs.");
        db.collection(collectonName)
          .doc(frameNumber)
          .set(
            {
              frameNumber: data[i]["Frame #"] || "",
              color: data[i]["Color"] || "",
              engineNumber: data[i]["Engine No"] || "",
              price: Math.round(price.toString()) || "",
              modelCategory: data[i]["Model Category"] || "",
              modelCode: data[i]["Model Code"] || "",
              modelName: data[i]["Model Variant"] || "",
              MTOC: data[i]["Product Name"] || "",
            },
            { merge: true }
          );
      }
      setLoading(false);
    });
  };

  const rows = Object.values(inventory).map((currElem: any) => {
    const { frameNumber, engineNumber, color, modelName, MTOC } = currElem;

    return {
      frameNumber,
      engineNumber,
      color,
      modelName,
      MTOC,
    };
  });
  return (
    <Form>
      <Row></Row>
      <Row>
        <Col xs="8">
          <h6 className="heading-small text-muted my-2">Inventory Table</h6>
        </Col>
        <Col className="text-right" xs="4">
          {!isOpen ? (
            <Button
              className="small-button-width my-2"
              color={"primary"}
              onClick={() => {
                setIsOpen(true);
              }}
              size="sm"
            >
              Open
            </Button>
          ) : (
            <>
              <Button
                className="small-button-width my-2"
                color={"danger"}
                onClick={(e) => {
                  setIsOpen(false);
                }}
                size="sm"
              >
                Close
              </Button>
            </>
          )}
        </Col>
      </Row>
      <Collapse isOpen={isOpen}>
        {loading ? (
          <>
            <div className="w-100 d-flex justify-content-center">
              <Loading />
            </div>
            <hr className="my-4" />
          </>
        ) : (
          inventory && (
            <>
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
                    <TableHeaderColumn dataSort={true} dataField="frameNumber">
                      Frame No
                    </TableHeaderColumn>
                    <TableHeaderColumn dataSort={true} dataField="engineNumber">
                      Engine No
                    </TableHeaderColumn>
                    <TableHeaderColumn dataSort={true} dataField="color">
                      Color
                    </TableHeaderColumn>
                    <TableHeaderColumn dataSort={true} dataField="modelName">
                      Model Name
                    </TableHeaderColumn>
                    <TableHeaderColumn dataSort={true} dataField="MTOC">
                      MTOC
                    </TableHeaderColumn>
                  </BootstrapTable>
                ) : (
                  <CardBody className="p-4">You are all done!</CardBody>
                )}
              </div>
              <hr className="my-4" />
            </>
          )
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
          </Col>
        </Row>
      </Collapse>
    </Form>
  );
};

export default InventoryTable;

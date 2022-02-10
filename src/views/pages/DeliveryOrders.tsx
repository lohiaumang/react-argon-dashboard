/*!
=========================================================
* Argon Dashboard React - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { useState, useEffect, useContext, useRef } from "react";
import { useReactToPrint } from "react-to-print";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Table,
  Container,
  Row,
  Input,
  ButtonDropdown,
  Button,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  CustomInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
} from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
//core components
import Header from "../../components/Headers/Header";
import DeliveryOrderTable, {
  DeliveryOrder,
  DealerInfo,
} from "../../components/Tables/DeliveryOrderTable";
import InvoiceTable from "../../components/Tables/InvoiceTable";
import EditDo from "../../components/Tables/EditDo";
import SmallLoading from "../../components/Share/SmallLoading";
import Loading from "../../components/Share/Loading";
import * as XLSX from "xlsx";

import {
  UserContext,
  InsuranceConfigContext,
  PriceConfigContext,
  // ModelWiseColorDescription,
} from "../../Context";
import firebase from "firebase/app";
import "firebase/firestore";
import { rejects } from "assert";
import { useCancellablePromise } from "../../hooks/useCancellablePromise";

declare global {
  interface Window {
    api: any;
  }
}

interface DeliveryOrders {
  [key: string]: DeliveryOrder;
}

const DeliveryOrders: React.FC = () => {
  const [user]: any = useContext(UserContext);
  const deliveryOrderTableRef =
    useRef() as React.MutableRefObject<HTMLDivElement>;
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrders>({});
  const [selected, setSelected] = useState<string>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showInvoice, setShowInvoice] = useState<boolean>(false);
  const [showDO, setShowDO] = useState<boolean>(false);
  const [showModalForInvoiceNo, setShowModalForInvoiceNo] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [dropdownButton, setDropdownButton] = useState(false);
  const priceConfig = useContext(PriceConfigContext);
  const insuranceConfig = useContext(InsuranceConfigContext);
  // const colorConfig = useContext(ModelWiseColorDescription) || {};

  const db = firebase.firestore();

  const [dealerInfo, setDealerInfo] = useState<DealerInfo>({
    name: "",
    phoneNumber: "",
    email: "",
    gst: "",
    pan: "",
    address: "",
    temporaryCertificate: "",
    uid: "",
  });

  const [currentStatus, setCurrentStatus] = useState<string>();
  const [showEditDo, setShowEditDo] = useState<boolean>(false);
  //const [hsnCode, setHsnCode] = useState<string>("");
  const [invoiceNo, setInvoiceNo] = useState<string>("");
  const [inputHsnCode, setInputHsnCode] = useState<string>("");
  const [inputInvoiceNo, setInputInvoiceNo] = useState<string>("");
  const toggle = () => setDropdownButton((prevState) => !prevState);
  const { cancellablePromise } = useCancellablePromise();
  const dealerId = user.dealerId || user.createdBy || user.uid || "";
  let collectonName = "inv" + "-" + dealerId;
  useEffect(() => {
    if (user && (user.createdBy || user.uid)) {
      if (!dealerInfo.name) {
        const dealerId = user.createdBy || user.uid || "";
        getSetUserData(dealerId);
      }

      setLoadingPage(true);
      let fetchBy: string = user.dealerId ? "subDealerId" : "dealerId";
      cancellablePromise(
        db
          .collection("deliveryOrders")
          .where(fetchBy, "==", user.createdBy || user.uid || "")
          .where("active", "==", true)
          .get()
      ).then((querySnapshot: any) => {
        let dOs: any = {};
        querySnapshot.docs.forEach((doc: any) => {
          dOs[doc.id] = {
            ...doc.data(),
            id: doc.id,
          };
        });

        setDeliveryOrders(dOs);
        setLoadingPage(false);
      });

      window.api.receive("fromMain", (statusData: any) => {
        switch (statusData.type) {
          case "INVOICE_CREATED": {
            //setHsnCode(statusData.data.hsnCode);
            setInvoiceNo(statusData.data.invoiceNo);
            setCurrentStatus(statusData.type);
            db.collection(collectonName)
              .doc(statusData.data.frameNumber)
              .delete();

            break;
          }
          case "DISABLE_LOADER": {
            setLoading(false);

            break;
          }
          case "DO_CREATED": {
            if (statusData.data) {
              //setHsnCode(statusData.data.hsnCode);
              setInvoiceNo(statusData.data.invoiceNo);
            }
            setLoading(false);

            break;
          }
          case "INSURANCE_CREATED": {
            setCurrentStatus(statusData.type);

            break;
          }
          case "DONE": {
            setCurrentStatus(statusData.type);

            break;
          }
          case "RESET": {
            // monthWiseSale(statusData.data);
            // // TODO: implement the same as above below vvv
            // weekWiseSale(statusData.data);
            // modelWiseSale(statusData.data);
            // salerCount(statusData.data);

            setLoading(false);
          }
        }
      });
    }

    return () => {
      window.api.clear();
    };
  }, []);

  // useEffect(() => {
  //   if (hsnCode && selected) {
  //     db.collection("vehicles")
  //       .doc(deliveryOrders[selected].vehicleId)
  //       .set(
  //         {
  //           hsnCode,
  //         },
  //         { merge: true }
  //       )
  //       .then(() => {
  //         let newDos: any = deliveryOrders;
  //         newDos[selected] = {
  //           ...deliveryOrders[selected],
  //           vehicleInfo: {
  //             ...deliveryOrders[selected].vehicleInfo,
  //             hsnCode,
  //           },
  //         };
  //         setDeliveryOrders(newDos);
  //       });
  //   }
  // }, [hsnCode]);

  useEffect(() => {
    if (invoiceNo && selected) {
      db.collection("deliveryOrders")
        .doc(deliveryOrders[selected].id)
        .set(
          {
            invoiceNo,
          },
          { merge: true }
        )
        .then(() => {
          let newDos: any = deliveryOrders;
          newDos[selected] = {
            ...deliveryOrders[selected],
            invoiceNo,
          };
          setDeliveryOrders(newDos);
        });
    }
  }, [invoiceNo]);

  useEffect(() => {
    if (
      selected !== undefined &&
      currentStatus !== undefined &&
      deliveryOrders[selected].status !== currentStatus
    ) {
      setLoading(true);
      db.collection("deliveryOrders")
        .doc(selected)
        .set(
          {
            status: currentStatus,
          },
          { merge: true }
        )
        .then(() => {
          // insurenceStatusCount();
          if (currentStatus !== "DONE") {
            // deleteDeliveryOrder();
            // doneStatusCount();
            // } else {
            let newDos: any = deliveryOrders;
            newDos[selected] = {
              ...deliveryOrders[selected],
              status: currentStatus,
            };
            setDeliveryOrders(newDos);
          }

          setLoading(false);
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    }
  }, [currentStatus]);

  // //dashboard status count
  // useEffect(() => {
  //   const dealerId = user.createdBy || user.uid || "";
  //   let tempData: any;

  //   if (
  //     selected !== undefined &&
  //     currentStatus !== undefined &&
  //     deliveryOrders[selected].status !== currentStatus &&
  //     deliveryOrders[selected].status === "PENDING"
  //   ) {
  //     const docRef = firebase.firestore().collection("status").doc(dealerId);
  //     docRef
  //       .get()
  //       .then((doc) => {
  //         if (doc.exists) {
  //           tempData = doc.data();
  //           //setDashBoardStatus(tempData);
  //         }
  //       })
  //       .then(() => {
  //         if (currentStatus === "DO_CREATED") {
  //           let statusCount: Number;
  //           statusCount = tempData.DO_CREATED + 1;
  //           db.collection("status").doc(dealerId).set(
  //             {
  //               DO_CREATED: statusCount,
  //             },
  //             { merge: true }
  //           );
  //         }
  //       })
  //       .then(() => {
  //         let statusCount: Number;
  //         statusCount = tempData.PENDING - 1;
  //         firebase.firestore().collection("status").doc(dealerId).set(
  //           {
  //             PENDING: statusCount,
  //           },
  //           { merge: true }
  //         );
  //       });
  //   }
  //   //dashboard invoice status count
  //   if (
  //     selected !== undefined &&
  //     currentStatus !== undefined &&
  //     deliveryOrders[selected].status !== currentStatus &&
  //     deliveryOrders[selected].status === "DO_CREATED"
  //   ) {
  //     const docRef = firebase.firestore().collection("status").doc(dealerId);
  //     docRef
  //       .get()
  //       .then((doc) => {
  //         if (doc.exists) {
  //           tempData = doc.data();
  //           //setDashBoardStatus(tempData);
  //         }
  //       })
  //       .then(() => {
  //         if (currentStatus === "INVOICE_CREATED") {
  //           let statusCount: Number;
  //           statusCount = tempData.INVOICE_CREATED + 1;
  //           db.collection("status").doc(dealerId).set(
  //             {
  //               INVOICE_CREATED: statusCount,
  //             },
  //             { merge: true }
  //           );
  //         }
  //       })
  //       .then(() => {
  //         let statusCount: Number;
  //         statusCount = tempData.DO_CREATED - 1;
  //         firebase.firestore().collection("status").doc(dealerId).set(
  //           {
  //             DO_CREATED: statusCount,
  //           },
  //           { merge: true }
  //         );
  //       });
  //   }
  //   //dashboard insurance status count
  //   if (
  //     selected !== undefined &&
  //     currentStatus !== undefined &&
  //     deliveryOrders[selected].status !== currentStatus &&
  //     deliveryOrders[selected].status === "INVOICE_CREATED"
  //   ) {
  //     const docRef = firebase.firestore().collection("status").doc(dealerId);
  //     docRef
  //       .get()
  //       .then((doc) => {
  //         if (doc.exists) {
  //           tempData = doc.data();
  //           //setDashBoardStatus(tempData);
  //         }
  //       })
  //       .then(() => {
  //         if (currentStatus === "INSURANCE_CREATED") {
  //           let statusCount: Number;
  //           statusCount = tempData.INSURENCE_CREATED + 1;
  //           db.collection("status").doc(dealerId).set(
  //             {
  //               INSURENCE_CREATED: statusCount,
  //             },
  //             { merge: true }
  //           );
  //         }
  //       })
  //       .then(() => {
  //         let statusCount: Number;
  //         statusCount = tempData.INVOICE_CREATED - 1;
  //         firebase.firestore().collection("status").doc(dealerId).set(
  //           {
  //             INVOICE_CREATED: statusCount,
  //           },
  //           { merge: true }
  //         );
  //       });
  //   }
  //   //dashboard done status count
  //   if (
  //     selected !== undefined &&
  //     currentStatus !== undefined &&
  //     deliveryOrders[selected].status !== currentStatus &&
  //     deliveryOrders[selected].status === "INSURANCE_CREATED"
  //   ) {
  //     const docRef = firebase.firestore().collection("status").doc(dealerId);
  //     docRef
  //       .get()
  //       .then((doc) => {
  //         if (doc.exists) {
  //           tempData = doc.data();
  //         }
  //       })
  //       .then(() => {
  //         if (currentStatus === "DONE") {
  //           let statusCount: Number;
  //           statusCount = tempData.DONE + 1;
  //           db.collection("status").doc(dealerId).set(
  //             {
  //               DONE: statusCount,
  //             },
  //             { merge: true }
  //           );
  //         }
  //       })
  //       .then(() => {
  //         let statusCount: Number;
  //         statusCount = tempData.INSURENCE_CREATED - 1;
  //         firebase.firestore().collection("status").doc(dealerId).set(
  //           {
  //             INSURENCE_CREATED: statusCount,
  //           },
  //           { merge: true }
  //         );
  //       });
  //   }
  // }, [currentStatus]);

  useEffect(() => {
    if (selected !== undefined) {
      setCurrentStatus(deliveryOrders[selected].status);
    }
  }, [selected]);

  useEffect(() => {
    if (!showModal) {
      setShowEditDo(showModal);
      setShowInvoice(showModal);
      setShowDO(showModal);
    }
  }, [showModal]);

  useEffect(() => {
    if (showDO || showInvoice) {
      setShowModal(true);
    }
  }, [showDO, showInvoice]);

  // const getActionButton = () => {
  //   if (selected !== undefined) {
  //   }
  // };

  const toggleSelected = (id: string) => {
    if (id === selected) {
      setSelected(undefined);
    } else {
      setSelected(id);
    }
  };

  const deleteDeliveryOrder = () => {
    if (selected !== undefined) {
      const tempOrders = deliveryOrders;
      delete tempOrders[selected];

      setSelected(undefined);
      setDeliveryOrders(tempOrders);
      db.collection("deliveryOrders").doc(selected).set(
        {
          active: false,
          status: "DONE",
        },
        { merge: true }
      );
    }
  };

  // TODO: Make fetching data if it does not exist common
  const fetchDeliveryOrder = () => {
    if (selected !== undefined) {
      const order = deliveryOrders[selected];
      let customerInfo: any,
        additionalInfo: any,
        vehicleInfo: any = {};

      if (order.customerInfo && order.vehicleInfo && order.additionalInfo) {
        return new Promise<boolean>((resolve) => {
          resolve(true);
        });
      } else {
        return new Promise<boolean>((resolve, reject) => {
          cancellablePromise(
            db.collection("customers").doc(order.customerId).get()
          )
            .then((doc: any) => {
              if (doc.exists) {
                customerInfo = doc.data();
                cancellablePromise(
                  db.collection("vehicles").doc(order.vehicleId).get()
                )
                  .then((doc: any) => {
                    if (doc.exists) {
                      vehicleInfo = doc.data();
                      cancellablePromise(
                        db
                          .collection("additionals")
                          .doc(order.additionalId)
                          .get()
                      )
                        .then((doc: any) => {
                          if (doc.exists) {
                            additionalInfo = doc.data();
                          }
                          const fullDetails = {
                            ...deliveryOrders[selected],
                            customerInfo,
                            vehicleInfo,
                            additionalInfo,
                          };
                          const tempOrders = deliveryOrders;
                          tempOrders[selected] = fullDetails;
                          setDeliveryOrders(tempOrders);
                          resolve(true);
                        })

                        .catch((error) => reject(error));
                    }
                  })
                  .catch((error) => reject(error));
              }
            })
            .catch((error) => reject(error));
        });
      }
    }
  }; // -> should return true or false promise

  const getSetUserData = (uid: string) => {
    if (uid && window && window.api) {
      window.api.receive("fromMain", (data: any) => {
        switch (data.type) {
          case "GET_DEALER_SUCCESS": {
            setDealerInfo(data.userData);
            break;
          }
          case "GET_DEALER_FAILURE": {
            setDealerInfo(data.userData);
            window.api.send("toMain", {
              type: "SET_DEALER",
              data: data.userData,
            });
            break;
          }
        }
      });
      window.api.send("toMain", {
        type: "GET_DEALER",
        data: {
          uid,
        },
      });
    }
  };

  const createDO = async () => {
    try {
      const status: any = await fetchDeliveryOrder();
      if (status) {
        // setShowModal(!showModal);
        setShowDO(!showDO);
        setLoading(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //print invoice
  const printInvoice = async () => {
    setLoading(true);
    if (selected && !deliveryOrders[selected].invoiceNo) {
      setShowModalForInvoiceNo(!showModalForInvoiceNo);
    } else {
      const status: any = await fetchDeliveryOrder();
      if (status) {
        // setShowModal(!showModal);
        setShowInvoice(!showInvoice);
      }
    }
    setLoading(false);
  };

  //save invoice no
  const saveInvoiceDetails = async () => {
    // setHsnCode(inputHsnCode);
    setInvoiceNo(inputInvoiceNo);

    setShowModalForInvoiceNo(!showModalForInvoiceNo);
    const status: any = await fetchDeliveryOrder();
    if (status) {
      // setShowModal(!showModal);
      setShowInvoice(!showInvoice);
    }
  };
  //create invoice
  const createInvoice = async () => {
    try {
      setLoading(true);
      if (selected !== undefined) {
        const status: any = await fetchDeliveryOrder();
        if (status) {
          window.api.send("toMain", {
            type: "CREATE_INVOICE",
            data: {
              ...deliveryOrders[selected],
            },
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //create insurance
  const createInsurance = async (insuranceCompany: string) => {
    try {
      setLoading(true);
      if (selected !== undefined) {
        const status: any = await fetchDeliveryOrder();

        if (status) {
          window.api.send("toMain", {
            type: "CREATE_INSURANCE",
            data: {
              ...deliveryOrders[selected],
              insuranceCompany,
              priceDetails: priceConfig[deliveryOrders[selected].modelName],
              insuranceDetails: insuranceConfig,
            },
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //create erp data
  const createRegistration = async () => {
    try {
      setLoading(true);
      if (selected !== undefined) {
        const status: any = await fetchDeliveryOrder();
        if (status) {
          window.api.send("toMain", {
            type: "CREATE_REGISTRATION",
            data: {
              ...deliveryOrders[selected],
              priceDetails: priceConfig[deliveryOrders[selected].modelName],
            },
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateDeliveryOrders = () => {
    if (user && (user.createdBy || user.uid)) {
      setLoadingPage(true);
      const dealerId = user.createdBy || user.uid || "";
      cancellablePromise(
        db.collection("deliveryOrders").where("dealerId", "==", dealerId).get()
      ).then((querySnapshot: any) => {
        let dOs: any = deliveryOrders;
        querySnapshot.docChanges().forEach((change: any) => {
          if (!(change.doc.id in dOs) && change.doc.data().active) {
            dOs[change.doc.id] = {
              ...change.doc.data(),
              id: change.doc.id,
            };
          } else if (change.doc.id in dOs && !change.doc.data().active) {
            delete dOs[change.doc.id];
          } else if (change.doc.id in dOs && change.doc.data().active) {
            dOs[change.doc.id] = {
              ...dOs[change.doc.id],
              ...change.doc.data(),
              id: change.doc.id,
            };
          }
        });
        setDeliveryOrders(dOs);
        setLoadingPage(false);
        setSelected(undefined);
      });
    }
    if (selected !== undefined) {
      setCurrentStatus(deliveryOrders[selected].status);
    }
  };

  //edit do
  const editDO = async (ev: React.SyntheticEvent) => {
    ev.stopPropagation();
    try {
      const status: any = await fetchDeliveryOrder();
      if (status) {
        setShowEditDo(!showEditDo);
        setShowModal(!showModal);
        setLoading(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //print DO
  const printPage = useReactToPrint({
    content: () => deliveryOrderTableRef.current,
    copyStyles: true,
    // documentTitle: "new document",
    // pageStyle: "print",

    onAfterPrint: () => {
      if (selected !== undefined) {
        setShowModal(false);
        if (currentStatus === "PENDING") {
          setCurrentStatus("DO_CREATED");
          // doStatusCount();
        } else {
          setCurrentStatus("INVOICE_CREATED");
          // invoiceStatusCount();
        }
      }
    },
  });

  //close model onclick on close button
  const closeModal = async () => {
    setShowModal(!showModal);
    setLoading(false);
  };

  const onCreate = (order?: DeliveryOrder) => {
    if (selected && order) {
      let orders = deliveryOrders;
      orders[selected] = order;

      setDeliveryOrders(orders);
      setCurrentStatus(order.status);

      closeModal();
    }
  };

  // const findSharedStart = (array: string[]) => {
  //   if (array.length <= 1) {
  //     return;
  //   }

  //   let A = array.concat().sort();
  //   let a1 = A[0];
  //   let a2 = A[A.length - 1];
  //   let L = a1.length;
  //   let i = 0;

  //   while (i < L && a1.charAt(i) === a2.charAt(i)) i++;

  //   return a1.substring(0, i);
  // };

  const rows = Object.values(deliveryOrders).map((currElem: any) => {
    const { name, modelName, color, status, createdOn, id, origin } = currElem;
    // let colorName =
    //   colorConfig && colorConfig[modelName]
    //     ? colorConfig[modelName][color]
    //     : "";
    // colorName =

    let date = new Date(createdOn)
      .toJSON()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("/");
    return {
      id,
      name,
      modelName,
      color,
      status: status.split("_").join(" "),
      date,
      origin,
    };
  });

  const customMultiSelect = (props: any) => {
    const { type, checked, disabled, onChange, rowIndex } = props;
    /*
     * If rowIndex is 'Header', means this rendering is for header selection column.
     */
    if (rowIndex === "Header") {
      return "";
    } else {
      return (
        <div className="checkbox-percustomMultiSelectsonalized">
          <Input
            className="position-relative"
            type={type}
            name={"checkbox" + rowIndex}
            id={"checkbox" + rowIndex}
            color="primary"
            checked={checked}
            disabled={disabled}
            style={{ cursor: "pointer" }}
            // onChange={() => toggleSelected(currElem.id)}
            onChange={(e) => onChange(e, rowIndex)}
          />
          <label htmlFor={"checkbox" + rowIndex}>
            <div className="check"></div>
          </label>
        </div>
      );
    }
  };

  const handleSelect = (row: any, isSelected: boolean, e: any) => {
    if (isSelected) {
      toggleSelected(row.id);
    }
  };

  const readExcel = async (file: any) => {
    setLoadingPage(true);
    let doData: any = deliveryOrders;

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
      let dealerId = user.createdBy || user.uid || "";
      let excelDeliveryOrder: any,
        customerInfo: any,
        additionalInfo: any,
        vehicleInfo: any = {};
      let vehicleId: string = "";
      let customerId: string = "";
      let additionalId: string = "";
      //let id: string = "";

      for (let i = 0; i < data.length; i++) {
        const stateCodes: any = {
          AN: "Andaman and Nicobar",
          AR: "Arunachal Pradesh",
          AS: "Assam",
          AP: "Andhra Pradesh",
          BR: "Bihar",
          Delhi: "Delhi",
          CG: "Chandigarh",
          CH: "Chhattisgarh",
          DD: "Daman and Diu",
          GOA: "Goa",
          Gujarat: "Gujarat",
          HP: "Himachal Pradesh",
          Haryana: "Haryana",
          Jharkhand: "Jharkhand",
          JK: "Jammu and kashmir",
          Karnataka: "Karnataka",
          Kerala: "Kerala",
          LD: "Lakshadweep",
          DN: "Dadra and Nagar Haveli",
          MH: "Maharashtra",
          Manipur: "Manipur",
          MP: "Madhya Pradesh",
          "Tamil Nadu": "Tamil Nadu",
          MZ: "Mizoram",
          Nagaland: "Nagaland",
          Odisha: "Orissa",
          Punjab: "Punjab",
          PY: "Puducherry",
          Rajasthan: "Rajasthan",
          SK: "Sikkim",
          ML: "Meghalaya",
          Telangana: "Telangana",
          Tripura: "Tripura",
          UK: "Uttarakhand",
          UP: "Uttar Pradesh",
          WB: "West Bengal",
          // TODO: Add all states codes here
        };

        let currStateCode = data[i]["State"];
        currStateCode = stateCodes[currStateCode];
        let permStateCode = data[i]["Temporary State"];
        permStateCode = stateCodes[permStateCode];

        const gender: any = {
          M: "male",
          F: "female",
        };
        let custGender = data[i]["Gender"];
        custGender = gender[custGender];
        let currLineTwo: any = data[i]["Address Line 2"] || "";
        let currLineTwo2 = currLineTwo.substr(0, currLineTwo.indexOf("PS") - 1);
        let currPS: any = data[i]["Address Line 2"] || "";
        let currPs2 = currPS.substr(currPS.indexOf("PS"));

        let permLineTwo: any = data[i]["Temporary Address2"] || "";
        let permLineTwo2 = permLineTwo.substr(0, permLineTwo.indexOf("PS") - 1);
        let permPS: any = data[i]["Temporary Address2"] || "";
        let permPS2 = permPS.substr(currPS.indexOf("PS"));

        customerInfo = {
          firstName: data[i]["Customer First Name"] || "",
          lastName: data[i]["Customer Last Name"] || "",
          swdo: data[i]["Relative Name"] || "",
          gender: custGender || "",
          email: data[i]["Customer Email Address"] || "",
          phoneNo: data[i]["Mobile Phone #"].toString() || "",
          dob: data[i]["Date of Birth"] || "",
          currLineOne: data[i]["Address Line 1"] || "",
          currLineTwo: currLineTwo2 || "",
          currPS: currPs2 || "",
          currDistrict: "" || "",
          currState: currStateCode || "",
          currCity: data[i]["City"] || "",
          currPostal: data[i]["Zip Code"].toString() || "",
          permLineOne: data[i]["Temporary Address"] || "",
          permLineTwo: permLineTwo2 || "",
          permCity: data[i]["Temporary City"] || "",
          permPS: permPS2 || "",
          permDistrict: "" || "",
          permState: permStateCode || "",
          permPostal: data[i]["Temporary Postal Code"].toString() || "",
          type: "" || "",
          category: data[i]["Enquiry Category"] || "",
          source: "" || "",
        };
        let currcustomerId = await firebase
          .firestore()
          .collection("customers")
          .add(customerInfo);
        customerId = currcustomerId.id;
        // customerInfo = {};
        //customerId = "";

        vehicleInfo = {
          color: data[i]["MTOC"] || "",
          frameNumber: data[i]["Frame #"] || "",
          engineNumber: data[i]["Engine #"] || "",
          modelName: data[i]["Model Variant"] || "",
          modelCategory: data[i]["Model Category"] || "",
          hsnCode: data[i]["HSN Code"].toString() || "",
          srNo: "" || "",
          batteryNO: data[i]["Battery Number"].toString() || "",
          keyNo: data[i]["Key No"].toString() || "",
        };
        let currvechicleId = await firebase
          .firestore()
          .collection("vehicles")
          .add(vehicleInfo);
        vehicleId = currvechicleId.id;
        // vehicleInfo = {};
        // vehicleId = "";

        additionalInfo = {
          hra: "" || "",
          joyClub: "" || "",
          accessories: "" || "",
          postalCharge: "" || "",
          ptfePolish: "" || "",
          price: data[i]["ExShowroom Price"].toString() || "",
          roadTaxWithRc: "" || "",
          extendedWarranty: "" || "",
          insuranceDeclaredValue: "" || "",
          inquiryType: "" || "",
          financier: data[i]["Financier"] || "",
          saleType: "" || "",
          downPayment: "" || "",
          accessoriesList: "" || "",
          hypothecation: data[i]["Hypothecation"] || "",
        };
        let curradditinalId = await firebase
          .firestore()
          .collection("additionals")
          .add(additionalInfo);
        additionalId = curradditinalId.id;
        //additionalInfo = {};
        // additionalId = "";

        excelDeliveryOrder = {
          createdOn: new Date().toString(),
          active: true,
          status: "INCOMPLETE",
          color: data[i]["MTOC"] || "",
          name:
            data[i]["Customer First Name"] +
              " " +
              data[i]["Customer Last Name"] || "",
          vehicleId: vehicleId || "",
          dealerId: dealerId || "",
          customerId: customerId || "",
          modelName: data[i]["Model Variant"] || "",
          additionalId: additionalId || "",
          createdBy: user.uid || "",
          initiatedBy: "XLSX",
          salesEx: data[i]["Assigned To (DSE) Name"] || "",
          invoiceNo: data[i]["Invoice #"] || "",
          origin:
            data[i]["Main Dealer Name"] ||
            data[i]["Requesting Dealer"] ||
            data[i]["Network Name"] ||
            "",
        };

        let { id } = await firebase
          .firestore()
          .collection("deliveryOrders")
          .add(excelDeliveryOrder);

        doData = {
          ...doData,
          [id]: excelDeliveryOrder,
        };

        //deliveryOrders = {};
      }

      setDeliveryOrders(doData);
      setLoadingPage(false);
    });
  };

  // //dashboard status count
  // const monthWiseSale = (dO: any) => {
  //   if (dO.modelName) {
  //     let tempData: any;
  //     const docRef = firebase
  //       .firestore()
  //       .collection("byMonth")
  //       .doc(user.createdBy);
  //     docRef
  //       .get()
  //       .then((doc) => {
  //         if (doc.exists) {
  //           tempData = doc.data();
  //         }
  //       })
  //       .then(() => {
  //         let totalSale: any = 0;
  //         let totalSaleNo: any = 0;
  //         // let config:any;
  //         const dateObj = new Date();
  //         const monthName = dateObj.toLocaleString("default", {
  //           month: "long",
  //         });
  //         if (tempData[monthName]) {
  //           totalSale = tempData[monthName].totalSaleValue;
  //           totalSaleNo = tempData[monthName].totalSaleNo;
  //         }

  //         var docData = {
  //           [monthName]: {
  //             totalSaleValue:
  //               totalSale + parseInt(priceConfig[dO.modelName].price),
  //             totalSaleNo: totalSaleNo + 1, // TODO: Increment by 1
  //           },
  //         };

  //         db.collection("byMonth")
  //           .doc(user.createdBy)
  //           .set(docData, { merge: true });
  //       });
  //   }
  // };

  // //week wise sale
  // const weekWiseSale = (dO: any) => {
  //   if (dO.modelName) {
  //     let tempData: any;
  //     const docRef = firebase
  //       .firestore()
  //       .collection("byWeek")
  //       .doc(user.createdBy);
  //     docRef
  //       .get()
  //       .then((doc) => {
  //         if (doc.exists) {
  //           tempData = doc.data();
  //         }
  //       })
  //       .then(() => {
  //         let totalSale: any = 0;
  //         let totalSaleNo: any = 0;
  //         let todaydate: any = new Date();
  //         let oneJan: any = new Date(todaydate.getFullYear(), 0, 1);
  //         let numberOfDays = Math.floor(
  //           (todaydate - oneJan) / (24 * 60 * 60 * 1000)
  //         );
  //         let result = Math.ceil((todaydate.getDay() + 1 + numberOfDays) / 7);
  //         if (tempData[result]) {
  //           totalSale = tempData[result].totalSaleValue;
  //           totalSaleNo = tempData[result].totalSaleNo;
  //         }

  //         var docData = {
  //           [result]: {
  //             totalSaleValue:
  //               totalSale + parseInt(priceConfig[dO.modelName].price),
  //             totalSaleNo: totalSaleNo + 1, // TODO: Increment by 1
  //           },
  //         };

  //         db.collection("byWeek")
  //           .doc(user.createdBy)
  //           .set(docData, { merge: true });
  //       });
  //   }
  // };

  // //model wise sale
  // const modelWiseSale = (dO: any) => {
  //   if (dO.modelName) {
  //     let tempData: any;
  //     const docRef = firebase
  //       .firestore()
  //       .collection("byModel")
  //       .doc(user.createdBy);
  //     docRef
  //       .get()
  //       .then((doc) => {
  //         if (doc.exists) {
  //           tempData = doc.data();
  //         }
  //       })
  //       .then(() => {
  //         let totalSale: any = 0;
  //         let totalSaleNo: any = 0;
  //         // let config:any;

  //         const modelName = dO.modelName;

  //         if (tempData[modelName]) {
  //           totalSale = tempData[modelName].totalSaleValue;
  //           totalSaleNo = tempData[modelName].totalSaleNo;
  //         }

  //         var docData = {
  //           [modelName]: {
  //             totalSaleValue:
  //               totalSale + parseInt(priceConfig[dO.modelName].price),
  //             totalSaleNo: totalSaleNo + 1, // TODO: Increment by 1
  //           },
  //         };

  //         db.collection("byModel")
  //           .doc(user.createdBy)
  //           .set(docData, { merge: true });
  //       });
  //   }
  // };

  // const salerCount = (dO: any) => {
  //   if (dO.modelName) {
  //     let tempData: any;
  //     const docRef = firebase
  //       .firestore()
  //       .collection("bySalesMan")
  //       .doc(user.createdBy);
  //     docRef
  //       .get()
  //       .then((doc) => {
  //         if (doc.exists) {
  //           tempData = doc.data();
  //         }
  //       })
  //       .then(() => {
  //         let userID: any;
  //         let salerName: any = user && user.name;
  //         let totalSale: any = 0;
  //         let totalSaleNo: any = 0;
  //         // let config:any;
  //         userID = user.uid;
  //         if (tempData[user.uid]) {
  //           salerName = tempData[user.uid].salesManName;
  //           totalSale = tempData[user.uid].totalSaleValue;
  //           totalSaleNo = tempData[user.uid].totalSaleNo;
  //         }

  //         var docData = {
  //           [userID]: {
  //             salesManName: salerName,
  //             totalSaleValue:
  //               totalSale + parseInt(priceConfig[dO.modelName].price),
  //             totalSaleNo: totalSaleNo + 1, // TODO: Increment by 1
  //           },
  //         };

  //         db.collection("bySalesMan")
  //           .doc(user.createdBy)
  //           .set(docData, { merge: true });
  //       });
  //   }
  // };

  return (
    <>
      {loading && (
        <div className="overlay" onClick={(ev) => ev.preventDefault()}></div>
      )}

      <Header />
      <Container className="mt--7">
        {showModalForInvoiceNo && selected !== undefined && (
          <Modal
            isOpen={showModalForInvoiceNo}
            toggle={() => setShowModal(!showModalForInvoiceNo)}
            backdrop="static"
            keyboard={false}
            size="lg"
            //onExit={() => closeModal()}
          >
            <ModalHeader
              className="p-4"
              tag="h3"
              toggle={() => setShowModalForInvoiceNo(!showModalForInvoiceNo)}
            >
              Enter details
            </ModalHeader>
            <ModalBody className="pb-4 px-4 py-0">
              <FormGroup row className="m-3">
                <Label for="invoice-no" sm={4}>
                  Invoice no.
                </Label>
                <Col sm={8}>
                  <Input
                    name="invoice-no"
                    id="invoice-no"
                    placeholder="Enter invoice no."
                    required
                    type="text"
                    value={inputInvoiceNo}
                    onChange={(ev) => setInputInvoiceNo(ev.target.value!)}
                  />
                </Col>
              </FormGroup>
              {/* {!hsnCode && (
                <FormGroup row className="m-3">
                  <Label for="invoice-no" sm={4}>
                    Vehicle HSN code
                  </Label>
                  <Col sm={8}>
                    <Input
                      name="hsn-code"
                      id="hsn-code"
                      placeholder="Enter HSN code"
                      required
                      type="text"
                      value={inputHsnCode}
                      onChange={(ev) => setInputHsnCode(ev.target.value!)}
                    />
                  </Col>
                </FormGroup>
              )} */}
            </ModalBody>
            {!showEditDo && (
              <ModalFooter>
                <Button color="primary" onClick={saveInvoiceDetails}>
                  Save
                </Button>{" "}
                <Button
                  color="secondary"
                  onClick={() =>
                    setShowModalForInvoiceNo(!showModalForInvoiceNo)
                  }
                >
                  Close
                </Button>
              </ModalFooter>
            )}
          </Modal>
        )}
        {showModal && selected !== undefined && (
          <Modal
            isOpen={showModal}
            toggle={() => setShowModal(!showModal)}
            backdrop="static"
            keyboard={false}
            size="lg"
            onExit={() => closeModal()}
          >
            <ModalHeader
              className="p-4"
              tag="h3"
              toggle={() => setShowModal(!showModal)}
            >
              {showEditDo || showDO ? "Delivery Order" : "Invoice"}
            </ModalHeader>
            <ModalBody className="pb-4 px-4 py-0">
              {showEditDo && (
                <EditDo
                  deliveryOrder={deliveryOrders[selected]}
                  onCreate={onCreate}
                />
              )}
              {showDO && (
                <DeliveryOrderTable
                  ref={deliveryOrderTableRef}
                  deliveryOrder={{
                    ...deliveryOrders[selected],
                    dealerInfo,
                  }}
                />
              )}
              {showInvoice && (
                <InvoiceTable
                  ref={deliveryOrderTableRef}
                  deliveryOrder={{
                    ...deliveryOrders[selected],
                    dealerInfo,
                  }}
                  //hsnCode={hsnCode}
                  invoiceNo={invoiceNo}
                />
              )}
            </ModalBody>
            {!showEditDo && (
              <ModalFooter>
                <Button color="secondary" onClick={() => closeModal()}>
                  Close
                </Button>
                <Button color="primary" onClick={printPage}>
                  Print
                </Button>{" "}
              </ModalFooter>
            )}
          </Modal>
        )}
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row>
                  <Col xs="2">
                    <h3 className="my-3">Delivery Orders</h3>
                  </Col>
                  <Col
                    className="d-flex justify-content-end align-items-center"
                    xs="10"
                  >
                    {!loadingPage && selected !== undefined && (
                      <>
                        <Button
                          className="small-button-width my-2"
                          color={"success"}
                          disabled={loading}
                          onClick={deleteDeliveryOrder}
                          size="sm"
                        >
                          Mark Done
                        </Button>
                        {selected !== undefined && (
                          <>
                            {user.dealerId ? (
                              <>
                                <ButtonDropdown
                                  className="mr-2"
                                  isOpen={dropdownButton}
                                  toggle={toggle}
                                >
                                  <>
                                    <DropdownToggle
                                      caret
                                      size="sm"
                                      color={"primary"}
                                    >
                                      Create Insurance
                                    </DropdownToggle>
                                    <DropdownMenu>
                                      <DropdownItem
                                        onClick={() => {
                                          createInsurance("HDFC");
                                        }}
                                      >
                                        HDFC
                                      </DropdownItem>
                                      <DropdownItem
                                        onClick={() => {
                                          createInsurance("ICICI");
                                        }}
                                      >
                                        ICICI
                                      </DropdownItem>
                                    </DropdownMenu>
                                  </>
                                </ButtonDropdown>
                                <Button
                                  className="small-button-width my-2"
                                  color={"primary"}
                                  onClick={createRegistration}
                                  size="sm"
                                >
                                  Create Registration
                                </Button>

                                <Button
                                  className="small-button-width my-2"
                                  color={"primary"}
                                  onClick={printInvoice}
                                  size="sm"
                                >
                                  Print Invoice
                                </Button>
                                <Button
                                  className="small-button-width my-2"
                                  color={"primary"}
                                  onClick={createDO}
                                  size="sm"
                                >
                                  Print DO
                                </Button>
                              </>
                            ) : (
                              <>
                                {deliveryOrders[selected].subDealerId ? (
                                  <>
                                    <Button
                                      className="small-button-width my-2"
                                      color={"primary"}
                                      onClick={createInvoice}
                                      size="sm"
                                    >
                                      Create Invoice
                                    </Button>
                                    <Button
                                      className="small-button-width my-2"
                                      color={"primary"}
                                      onClick={printInvoice}
                                      size="sm"
                                    >
                                      Print Invoice
                                    </Button>
                                  </>
                                ) : (
                                  deliveryOrders[selected].status !==
                                    "INCOMPLETE" &&
                                  deliveryOrders[selected].initiatedBy !==
                                    "XLSX" && (
                                    <>
                                      <Button
                                        className="small-button-width my-2"
                                        color={"primary"}
                                        onClick={createInvoice}
                                        size="sm"
                                      >
                                        Create Invoice
                                      </Button>
                                      <ButtonDropdown
                                        className="mr-2"
                                        isOpen={dropdownButton}
                                        toggle={toggle}
                                      >
                                        <>
                                          <DropdownToggle
                                            caret
                                            size="sm"
                                            color={"primary"}
                                          >
                                            Create Insurance
                                          </DropdownToggle>
                                          <DropdownMenu>
                                            <DropdownItem
                                              onClick={() => {
                                                createInsurance("HDFC");
                                              }}
                                            >
                                              HDFC
                                            </DropdownItem>
                                            <DropdownItem
                                              onClick={() => {
                                                createInsurance("ICICI");
                                              }}
                                            >
                                              ICICI
                                            </DropdownItem>
                                          </DropdownMenu>
                                        </>
                                      </ButtonDropdown>
                                      <Button
                                        className="small-button-width my-2"
                                        color={"primary"}
                                        onClick={createRegistration}
                                        size="sm"
                                      >
                                        Create Registration
                                      </Button>

                                      <Button
                                        className="small-button-width my-2"
                                        color={"primary"}
                                        onClick={printInvoice}
                                        size="sm"
                                      >
                                        Print Invoice
                                      </Button>
                                      <Button
                                        className="small-button-width my-2"
                                        color={"primary"}
                                        onClick={createDO}
                                        size="sm"
                                      >
                                        Print DO
                                      </Button>
                                    </>
                                  )
                                )}
                              </>
                            )}

                            {/* {getActionButton()} */}
                          </>
                        )}

                        {deliveryOrders[selected].initiatedBy === "XLSX" &&
                          deliveryOrders[selected].status !== "INCOMPLETE" && (
                            <>
                              <ButtonDropdown
                                className="mr-2"
                                isOpen={dropdownButton}
                                toggle={toggle}
                              >
                                <>
                                  <DropdownToggle
                                    caret
                                    size="sm"
                                    color={"primary"}
                                  >
                                    Create Insurance
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem
                                      onClick={() => {
                                        createInsurance("HDFC");
                                      }}
                                    >
                                      HDFC
                                    </DropdownItem>
                                    <DropdownItem
                                      onClick={() => {
                                        createInsurance("ICICI");
                                      }}
                                    >
                                      ICICI
                                    </DropdownItem>
                                  </DropdownMenu>
                                </>
                              </ButtonDropdown>
                              <Button
                                className="small-button-width my-2"
                                color={"primary"}
                                onClick={createRegistration}
                                size="sm"
                              >
                                Create Registration
                              </Button>

                              <Button
                                className="small-button-width my-2"
                                color={"primary"}
                                onClick={printInvoice}
                                size="sm"
                              >
                                Print Invoice
                              </Button>
                              <Button
                                className="small-button-width my-2"
                                color={"primary"}
                                onClick={createDO}
                                size="sm"
                              >
                                Print DO
                              </Button>
                            </>
                          )}

                        <Button
                          className="my-2"
                          color={"primary"}
                          disabled={loading}
                          onClick={editDO}
                          size="sm"
                          title="Edit"
                        >
                          <i className="fas fa-pencil-alt" />
                        </Button>
                      </>
                    )}
                    <Button
                      className="my-2"
                      color={"primary"}
                      disabled={loadingPage}
                      onClick={updateDeliveryOrders}
                      size="sm"
                      title="Refresh"
                    >
                      <i className="fas fa-sync-alt" />
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              {loadingPage ? (
                <>
                  <div className="w-100 my-4 d-flex justify-content-center">
                    <Loading />
                  </div>
                </>
              ) : (
                <div style={{ padding: "7px" }}>
                  {Object.values(deliveryOrders).length > 0 ? (
                    <BootstrapTable
                      data={rows}
                      striped
                      hover
                      keyField="id"
                      selectRow={{
                        mode: "radio",
                        customComponent: customMultiSelect,
                        onSelect: handleSelect,
                      }}
                      pagination
                      search={true}
                    >
                      <TableHeaderColumn dataSort={true} dataField="id" hidden>
                        Id
                      </TableHeaderColumn>
                      <TableHeaderColumn dataSort={true} dataField="name">
                        Name
                      </TableHeaderColumn>
                      <TableHeaderColumn dataSort={true} dataField="modelName">
                        Model Name
                      </TableHeaderColumn>
                      <TableHeaderColumn dataSort={true} dataField="color">
                        Colour
                      </TableHeaderColumn>
                      <TableHeaderColumn dataSort={true} dataField="status">
                        Status
                      </TableHeaderColumn>
                      <TableHeaderColumn dataSort={true} dataField="date">
                        Date
                      </TableHeaderColumn>
                      <TableHeaderColumn dataSort={true} dataField="origin">
                        Origin
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
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default DeliveryOrders;

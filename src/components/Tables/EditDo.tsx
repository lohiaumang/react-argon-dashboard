import React, { useState, useEffect, useContext } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Media,
  Row,
  Table,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

import { DeliveryOrder } from "./DeliveryOrderTable";
import firebase from "firebase/app";
import "firebase/firestore";
import SmallLoading from "../../components/Share/SmallLoading";
import { isEmpty } from "lodash";

import {
  InsuranceConfigContext,
  PriceCinfigContext,
  UserContext,
} from "../../Context";

type Props = {
  deliveryOrder: DeliveryOrder;
  onCreate: (order?: DeliveryOrder) => void;
};

let initialAdditionalInfo: any = {
  extendedWarranty: "extWarrantyFourYears",
  hra: "false",
  inquiryType: "we",
  joyClub: "false",
  postalCharge: "25",
  ptfePolish: "0",
};

let initialCustomerInfo: any = {
  source: "Banner",
  category: "ftb",
  type: "individual",
};

const EditDo: React.FC<Props> = ({ deliveryOrder, onCreate }) => {
  const [currDo, setCurrDo] = useState<DeliveryOrder>(deliveryOrder);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [editDoLoading, setEditDoLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<{ message: string }>();
  const [states, setStates] = useState<any>();
  // const [executive, setExecutive] = useState<any>();
  const [accessories, setAccessories] = useState<any>();
  const [purchaseType, setPurchaseType] = useState<string>("cash");
  const [catogryType, setCatogryType] = useState<string>("individual");
  const [postalCharge, setPostalCharge] = useState<any>({});
  const [ptefCharge, setptefCharge] = useState<any>({});

  const [userInfoUpdateError, setDoInfoUpdateError] = useState<{
    code: string;
    message: string;
  }>();

  const priceConfig = useContext(PriceCinfigContext);
  const insuranceConfig = useContext(InsuranceConfigContext);
  const [user] = useContext(UserContext);

  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(undefined), 1500);
    }
  }, [success]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("states")
      .get()
      .then((querySnapshot) => {
        let tempStates: any = {};

        querySnapshot.docs.map((doc) => {
          if (doc.exists) {
            tempStates[doc.id] = doc.data();
          }
        });

        setStates(tempStates);
      });

    if (deliveryOrder && deliveryOrder.modelName) {
      updateAccessories(deliveryOrder.modelName);
    }

    setCurrDo({
      ...deliveryOrder,
      additionalInfo: {
        ...initialAdditionalInfo,
        ...deliveryOrder.additionalInfo,
      },
      customerInfo: {
        ...initialCustomerInfo,
        ...deliveryOrder.customerInfo,
      },
    });

    const docRef = firebase
      .firestore()
      .collection("priceConfig")
      .doc("otherPriceConfig");
    docRef.get().then((doc) => {
      if (doc.exists) {
        let otherPriceDetails: any = doc.data();
        setPostalCharge(Object.values(otherPriceDetails.postalCharge));
        setptefCharge(Object.values(otherPriceDetails.ptfe));
        //console.log(Object.values(otherPriceDetails.postalCharge), "get postal charge");
      }
    });
  }, []);

  useEffect(() => {
    if (currDo.modelName) {
      updateAccessories(currDo.modelName);
    }
  }, [currDo.modelName]);

  useEffect(() => {
    if (deliveryOrder) {
      let aInfo: any = {
        ...initialAdditionalInfo,
        ...deliveryOrder.additionalInfo,
      };

      if (deliveryOrder.modelName && priceConfig[deliveryOrder.modelName]) {
        Object.keys(priceConfig[currDo.modelName]).map((key) => {
          aInfo[key] = priceConfig[currDo.modelName][key];
        });
      }

      if (aInfo.financier) {
        setPurchaseType("finance");
      }

      setCurrDo({
        ...currDo,
        additionalInfo: aInfo,
        customerInfo: {
          ...initialCustomerInfo,
          ...deliveryOrder.customerInfo,
        },
      });
    }
  }, [deliveryOrder]);

  // useEffect(() => {
  //   if (currDo.customerInfo?.sameAddress === "true") {
  //     setCurrDo({
  //       ...currDo,
  //       customerInfo: {
  //         ...currDo.customerInfo,
  //         permLineOne: currDo.customerInfo.currLineOne || "",
  //         permLineTwo: currDo.customerInfo.currLineTwo || "",
  //         permCity: currDo.customerInfo.currCity || "",
  //         permPS: currDo.customerInfo.currPS || "",
  //         permState: currDo.customerInfo.currState || "",
  //         permDistrict: currDo.customerInfo.currDistrict || "",
  //         permPostal: currDo.customerInfo.currPostal || "",
  //       },
  //     });
  //   }
  // }, [currDo.customerInfo]);

  const updateAccessories = (modelName: string) => {
    debugger;
    if (user) {
      const fetchId = user.subDealerId || user.dealerId || user.uid;

      firebase
        .firestore()
        .collection("accessories")
        .doc("accessoriesMap")
        .get()
        .then((doc) => {
          if (doc.exists) {
            const accessoriesMap = doc.data() || {};
            const fetchId = user.subDealerId || user.dealerId || user.uid;

            firebase
              .firestore()
              .collection("accessories")
              .doc(fetchId)
              .get()
              .then((doc) => {
                if (doc.exists) {
                  const accessoriesConfig = doc.data() || {};

                  const accessories =
                    accessoriesConfig[accessoriesMap[modelName]];

                  setAccessories(accessories);
                }
              });
          }
        });
    }
  };

  if (currDo) {
    let {
      customerInfo = {},
      additionalInfo = {},
      vehicleInfo = {},
    }: {
      customerInfo?: any;
      additionalInfo?: any;
      vehicleInfo?: any;
    } = currDo;

    const getDeliveryOrder = async (status: string) => {
      setEditDoLoading(true);

      let vehicleId: string = currDo.vehicleId || "";
      let customerId: string = currDo.customerId || "";
      let additionalId: string = currDo.additionalId || "";
      let id: string = currDo.id || "";

      if (customerInfo.sameAddress === "true") {
        customerInfo = {
          ...customerInfo,
          permLineOne: customerInfo.currLineOne || "",
          permLineTwo: customerInfo.currLineTwo || "",
          permCity: customerInfo.currCity || "",
          permPS: customerInfo.currPS || "",
          permState: customerInfo.currState || "",
          permDistrict: customerInfo.currDistrict || "",
          permPostal: customerInfo.currPostal || "",
        };
      }

      if (!vehicleId && vehicleInfo && !isEmpty(vehicleInfo)) {
        const data = await firebase
          .firestore()
          .collection("vehicles")
          .add(vehicleInfo);
        vehicleId = data.id;
      } else if (vehicleId && vehicleInfo) {
        const data = await firebase
          .firestore()
          .collection("vehicles")
          .doc(vehicleId)
          .set(vehicleInfo, { merge: true });
      }

      if (!customerId && customerInfo && !isEmpty(customerInfo)) {
        const data = await firebase
          .firestore()
          .collection("customers")
          .add(customerInfo);
        customerId = data.id;
      } else if (customerId && customerInfo) {
        const data = await firebase
          .firestore()
          .collection("customers")
          .doc(customerId)
          .set(customerInfo, { merge: true });
      }

      if (!additionalId && additionalInfo && !isEmpty(additionalInfo)) {
        const data = await firebase
          .firestore()
          .collection("additionals")
          .add(additionalInfo);
        additionalId = data.id;
      } else if (additionalId && additionalInfo) {
        const data = await firebase
          .firestore()
          .collection("additionals")
          .doc(additionalId)
          .set(additionalInfo, { merge: true });
      }

      let order: any = {
        ...currDo,
        status,
        active: true,
        initiatedBy:
          currDo.createdBy === "google_form"
            ? "google_form"
            : currDo.initiatedBy || user.uid,
        createdOn: currDo.createdOn || new Date().toString(),
        createdBy: user.uid,
        name: customerInfo.lastName
          ? `${customerInfo.firstName} ${customerInfo.lastName}`
          : customerInfo.firstName,
        modelName: vehicleInfo.modelName,
        color: vehicleInfo.color,
      };

      if (customerId) {
        order.customerId = customerId;
      }

      if (vehicleId) {
        order.vehicleId = vehicleId;
      }

      if (additionalId) {
        order.additionalId = additionalId;
      }

      if (order.vehicleInfo) {
        delete order.vehicleInfo;
      }

      if (order.customerInfo) {
        delete order.customerInfo;
      }

      if (order.additionalInfo) {
        delete order.additionalInfo;
      }

      if (!id && order && !isEmpty(order)) {
        const data = await firebase
          .firestore()
          .collection("deliveryOrders")
          .add(order);
        order.id = data.id;
      } else if (id && order) {
        const data = await firebase
          .firestore()
          .collection("deliveryOrders")
          .doc(id)
          .set(order, { merge: true });
      }
      //dashboard status count
      // if (currDo.status === "INCOMPLETE" && status === "PENDING") {
      //   const docRef = firebase.firestore().collection("status").doc(dealerId);
      //   docRef
      //     .get()
      //     .then((doc) => {
      //       if (doc.exists) {
      //         tempData = doc.data();
      //         //setDashBoardStatus(tempData);
      //       }
      //     })
      //     .then(() => {
      //       let statusCount: Number;
      //       statusCount =
      //         tempData && tempData.PENDING ? tempData.PENDING + 1 : 1;
      //       firebase.firestore().collection("status").doc(dealerId).set(
      //         {
      //           PENDING: statusCount,
      //         },
      //         { merge: true }
      //       );
      //     })
      //     .then(() => {
      //       let statusCount: Number;
      //       statusCount = tempData.INCOMPLETE - 1;
      //       firebase.firestore().collection("status").doc(dealerId).set(
      //         {
      //           INCOMPLETE: statusCount,
      //         },
      //         { merge: true }
      //       );
      //     });
      // }

      //dashboard status End
      setEditDoLoading(false);
      return [order, { vehicleInfo, customerInfo, additionalInfo }];
    };

    //save  function
    const onSave = async () => {
      setEditDoLoading(true);
      const [order, info] = await getDeliveryOrder("INCOMPLETE");
      onCreate({
        ...order,
        ...info,
      });
      setEditDoLoading(false);
    };

    const updateCurrModel = (event: React.ChangeEvent<HTMLInputElement>) => {
      // TODO: Update pricing, etc.
      let newModelName = event.target.value!;

      if (newModelName && priceConfig[newModelName]) {
        let keys = Object.keys(priceConfig[newModelName]);
        keys.map((x) => {
          additionalInfo[x] = priceConfig[newModelName][x];
        });

        setCurrDo({
          ...currDo,
          additionalInfo,
          modelName: event.target.value!,
        });
      }
    };

    const uploadImage = async (ev: any) => {
      const file = ev.target.files[0];
      customerInfo.photoString = await convertBase64(file);
      setCurrDo({
        ...currDo,
        customerInfo,
      });
    };

    const uploadFrontImage = async (ev: any) => {
      const file = ev.target.files[0];
      customerInfo.idOnePhotoString = await convertBase64(file);
      setCurrDo({
        ...currDo,
        customerInfo,
      });
    };

    const uploadBackImage = async (ev: any) => {
      const file = ev.target.files[0];
      customerInfo.idTwoPhotoString = await convertBase64(file);
      setCurrDo({
        ...currDo,
        customerInfo,
      });
      //  console.log(base64);
      //setBaseImage(base64);
    };

    const convertBase64 = (file: any) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    };

    if (additionalInfo) {
      console.log(additionalInfo.accessories, additionalInfo.accessoriesList);
    }

    return (
      <div>
        {editDoLoading && (
          <div className="overlay" onClick={(ev) => ev.preventDefault()}></div>
        )}
        <Container>
          <Row>
            <Col className="order-xl-1" xl="12">
              <Row className="align-items-center">
                {success && (
                  <div className="position-fixed  right-0 w-100 d-flex justify-content-center">
                    <Alert color="primary">{success.message}</Alert>
                  </div>
                )}

                {userInfoUpdateError && (
                  <small className="text-danger">
                    {userInfoUpdateError.message}
                  </small>
                )}
              </Row>
              <Form
                onSubmit={async (ev: any) => {
                  ev.preventDefault();
                  if (deliveryOrder.status === "DO_CREATED") {
                    const [order, info] = await getDeliveryOrder("DO_CREATED");
                    onCreate({
                      ...order,
                      ...info,
                    });
                  } else {
                    const [order, info] = await getDeliveryOrder("PENDING");
                    onCreate({
                      ...order,
                      ...info,
                    });
                  }
                }}
              >
                <Row>
                  {/* <Col xs="8">
                    <h6 className="heading-small text-muted mb-4">
                      Customer information
                    </h6>
                  </Col> */}
                  <Col className="text-right" xs="12">
                    <Button
                      className="small-button-width"
                      color={"success"}
                      type="submit"
                      size="sm"
                    >
                      Create Do
                    </Button>
                    {deliveryOrder.status === "PENDING" ||
                      (deliveryOrder.status === "INCOMPLETE" && (
                        <Button
                          className="small-button-width"
                          color={"success"}
                          type="button"
                          size="sm"
                          onClick={onSave}
                        >
                          Save
                        </Button>
                      ))}
                  </Col>
                </Row>
                <div className="pl-lg-4">
                  <Row>
                    <Col xs="8">
                      <h6 className="heading-small text-muted mb-4">
                        Customer information
                      </h6>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-source"
                        >
                          CUSTOMER CATAGORY
                        </label>
                        <Input
                          required
                          type="select"
                          name="select-customer-catogry"
                          id="input-scustomer-catogry"
                          placeholder="Customer Catogry"
                          value={customerInfo && customerInfo.type}
                          onChange={(ev) => {
                            if (ev.target.value! !== "individual") {
                              delete customerInfo.lastName;
                            }

                            customerInfo.type = ev.target.value!;

                            setCurrDo({
                              ...currDo,
                              customerInfo,
                            });
                            setCatogryType(ev.target.value!);
                          }}
                        >
                          <option key="individual" value="individual">
                            INDIVIDUAL
                          </option>
                          <option key="corporate" value="corporate">
                            CORPORATE
                          </option>
                          <option key="cpc" value="cpc">
                            CPC
                          </option>
                          <option key="csd" value="csd">
                            CSD
                          </option>
                          <option key="dgsd&d" value="dgsd&d">
                            DGSD&D
                          </option>
                          <option key="govt.bodies" value="govt.bodies">
                            GOVT.BODIES
                          </option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-customer-type"
                        >
                          CUSTOMER TYPE
                        </label>
                        <Input
                          required
                          type="select"
                          name="select-customer-type"
                          id="input-customer-type"
                          placeholder=" Customer Type"
                          value={customerInfo && customerInfo.category}
                          onChange={(ev) => {
                            customerInfo.category = ev.target.value!;
                            setCurrDo({
                              ...currDo,
                              customerInfo,
                            });
                          }}
                        >
                          <option value="ftb">FIRST TIME BUYER</option>
                          <option value="ab">ADDITIONAL BUYER</option>
                          <option value="rb">REPLACEMENT BUYER</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-customer-name"
                        >
                          CUSTOMER NAME
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-customer-name"
                          required
                          value={customerInfo && customerInfo.firstName}
                          onChange={(ev) => {
                            customerInfo.firstName =
                              ev.target.value.toLocaleUpperCase()!;
                            currDo.name = ev.target.value.toLocaleUpperCase()!;
                            setCurrDo({
                              ...currDo,
                              customerInfo,
                            });
                          }}
                          placeholder="Enter Customer Name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    {catogryType === "individual" && (
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-customer-lastName"
                          >
                            CUSTOMER LAST NAME
                          </label>
                          <Input
                            required
                            className="form-control-alternative"
                            id="input-customer-lastName"
                            value={customerInfo && customerInfo.lastName}
                            onChange={(ev) => {
                              customerInfo.lastName =
                                ev.target.value.toLocaleUpperCase()!;
                              setCurrDo({
                                ...currDo,
                                customerInfo,
                              });
                            }}
                            placeholder="Enter Customer Last Name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    )}
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-role"
                        >
                          GENDER
                        </label>
                        <Input
                          type="select"
                          name="select-role"
                          id="input-role"
                          required
                          placeholder="Role"
                          value={customerInfo && customerInfo.gender}
                          onChange={(ev) => {
                            customerInfo.gender = ev.target.value!;
                            setCurrDo({
                              ...currDo,
                              customerInfo,
                            });
                          }}
                        >
                          <option>Select Gender</option>
                          <option value="male">MALE</option>
                          <option value="female">FEMALE</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="S/D/W/O">
                          S/D/W/O NAME
                        </label>
                        <Input
                          required
                          className="form-control-alternative"
                          id="S/D/W/O"
                          value={customerInfo && customerInfo.swdo}
                          onChange={(ev) => {
                            customerInfo.swdo =
                              ev.target.value.toLocaleUpperCase()!;
                            setCurrDo({
                              ...currDo,
                              customerInfo,
                            });
                          }}
                          placeholder="S/D/W/O Name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-email"
                        >
                          EMAIL ADDRESS
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-email"
                          value={customerInfo && customerInfo.email}
                          onChange={(ev) => {
                            customerInfo.email = ev.target.value!;
                            setCurrDo({
                              ...currDo,
                              customerInfo,
                            });
                          }}
                          placeholder="abc@xyz.def"
                          type="email"
                          pattern="^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$"
                          title="Email should be in the format abc@xyz.def"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-phone-number"
                        >
                          PHONE NUMBER
                        </label>
                        <Input
                          required
                          className="form-control-alternative"
                          id="input-phone-number"
                          value={customerInfo && customerInfo.phoneNo}
                          onChange={(ev) => {
                            customerInfo.phoneNo = ev.target.value!;
                            setCurrDo({
                              ...currDo,
                              customerInfo,
                            });
                          }}
                          placeholder="9999999999"
                          type="tel"
                          pattern="^\d{10}$"
                          title="Phone number should exactly contain 10 digits"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="date-of-birth"
                        >
                          DATE OF BIRTH
                        </label>
                        <Input
                          required
                          className="form-control-alternative"
                          id="date-of-birth"
                          value={
                            customerInfo &&
                            customerInfo.dob &&
                            customerInfo.dob.split("/").reverse().join("-")
                          }
                          onChange={(ev) => {
                            customerInfo.dob = ev.target
                              .value!.split("-")
                              .reverse()
                              .join("/");
                            setCurrDo({
                              ...currDo,
                              customerInfo,
                            });
                          }}
                          placeholder="Date Of Birth"
                          type="date"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-source"
                        >
                          SOURCE TYPE
                        </label>
                        <Input
                          required
                          type="select"
                          name="select-source-type"
                          id="input-source-type"
                          placeholder=" Source Type"
                          value={customerInfo && customerInfo.source}
                          onChange={(ev) => {
                            customerInfo.source = ev.target.value!;
                            setCurrDo({
                              ...currDo,
                              customerInfo,
                            });
                          }}
                        >
                          <option value="Auto Hood Promotion">
                            AUTO HOOD PROMOTION
                          </option>
                          <option value="Banner">BANNER</option>
                          <option value="Bus Back Panel Promotions">
                            BUS BACK PANEL PROMOTIONS
                          </option>
                          <option value="Bus Shelter Branding">
                            BUS SHELTER BRANDING
                          </option>
                          <option value="Canopy">CANOPY</option>
                          <option value="Cold Calling">COLD CALLING</option>
                          <option value="Demo Van">DEMO VAN</option>
                          <option value="Digital Campaign">
                            DIGITAL CAMPAIGN
                          </option>
                          <option value="Display Activity">
                            DISPLAY ACTIVITY
                          </option>
                          <option value="Door 2 Door Activity">
                            DOOR 2 DOOR ACTIVITY
                          </option>
                          <option value="FM Campaign">FM CAMPAIGN</option>
                          <option value="Facebook">FACEBOOK</option>
                          <option value="Friend">FRIEND</option>
                          <option value="Hoarding">HOARDING</option>
                          <option value="Inst.Activity">INST.ACTIVITY</option>
                          <option value="Leaflet">LEAFLET</option>
                          <option value="Mall Activity">MALL ACTIVITY</option>
                          <option value="Mela">MELA</option>
                          <option value="Newspaper">NEWSPAPER</option>
                          <option value="Online Boking">ONLINE BOKING</option>
                          <option value="Radio">RADIO</option>
                          <option value="Relative">RELATIVE</option>
                          <option value="RoadShow">ROADSHOW</option>
                          <option value="Safety Activity">
                            SAFETY ACTIVITY
                          </option>
                          <option value="Tv">TV</option>
                          <option value="Tag">TAG</option>
                          <option value="Wall Wrap">WALL WRAP</option>
                          <option value="Website">WEBSITE</option>
                          <option value="Workshop">WORKSHOP</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-sales-man-name"
                        >
                          SALES EXECUTIVE
                        </label>
                        <Input
                          required
                          className="form-control-alternative"
                          id="input-sales-man-name"
                          value={currDo.salesEx}
                          onChange={(ev) => {
                            let dO = currDo;
                            dO.salesEx = ev.target.value.toLocaleUpperCase()!;

                            setCurrDo({ ...dO });
                          }}
                          placeholder="Sales Executive"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-cust-image"
                        >
                          CUSTOMER IMAGE
                        </label>
                        <Input
                          type="file"
                          name="select-cust-image"
                          id="input-cust-image"
                          placeholder="Upload Customer Image"
                          onChange={(ev) => {
                            uploadImage(ev);
                          }}
                        ></Input>
                      </FormGroup>
                      <Media>
                        <img
                          src={
                            customerInfo.photoString ||
                            require("../../assets/img/theme/human-avatar.png")
                          }
                          height="auto"
                          width="200px"
                          // onclick={enlargeImg()}
                          // onClick={() => {
                          //   enlargeImg();
                          // }}
                        ></img>
                      </Media>
                      {/* <Button
                        onClick={() => {
                          resetImg();
                        }}
                      >
                        Reset
                      </Button> */}
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-id-image"
                        >
                          ID FRONT IMAGE
                        </label>
                        <Input
                          type="file"
                          name="select-id-image"
                          id="input-id-image"
                          placeholder="Upload ID Front Image"
                          onChange={(ev) => {
                            uploadFrontImage(ev);
                          }}
                        ></Input>
                      </FormGroup>
                      <Media>
                        <img
                          src={
                            customerInfo.idOnePhotoString ||
                            require("../../assets/img/theme/id.png")
                          }
                          height="auto"
                          width="200px"
                          // onclick={enlargeImg()}
                          // onClick={() => {
                          //   enlargeImg();
                          // }}
                        ></img>
                      </Media>
                    </Col>

                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-id2-image"
                        >
                          ID BACK IMAGE
                        </label>
                        <Input
                          type="file"
                          name="select-id2-image"
                          id="input-cust-image"
                          placeholder="Upload ID Back Image"
                          onChange={(ev) => {
                            uploadBackImage(ev);
                          }}
                        ></Input>
                      </FormGroup>
                      <Media>
                        <img
                          src={
                            customerInfo.idTwoPhotoString ||
                            require("../../assets/img/theme/id.png")
                          }
                          height="auto"
                          width="200px"
                          // onclick={enlargeImg()}
                          // onClick={() => {
                          //   enlargeImg();
                          // }}
                        ></img>
                      </Media>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="8" style={{ marginTop: "35px" }}>
                      <h6 className="heading-small text-muted mb-4 ">
                        PRRSENT ADDRESS
                      </h6>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="curr-add-line-1"
                        >
                          LINE 1
                        </label>
                        <Input
                          required
                          className="form-control-alternative"
                          id="curr-add-line-1"
                          value={customerInfo && customerInfo.currLineOne}
                          onChange={(ev) => {
                            customerInfo.currLineOne =
                              ev.target.value.toLocaleUpperCase()!;
                            setCurrDo({
                              ...currDo,
                              customerInfo,
                            });
                          }}
                          placeholder="Enter Address Line 1"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="curr-add-line-2"
                        >
                          LINE 2
                        </label>
                        <Input
                          required
                          className="form-control-alternative"
                          id="curr-add-line-2"
                          value={customerInfo && customerInfo.currLineTwo}
                          onChange={(ev) => {
                            customerInfo.currLineTwo =
                              ev.target.value.toLocaleUpperCase()!;
                            setCurrDo({
                              ...currDo,
                              customerInfo,
                            });
                          }}
                          placeholder="Enter Address Line 2"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input--curr-ps-landmark"
                        >
                          PS/LANDMARK
                        </label>
                        <Input
                          required
                          className="form-control-alternative"
                          id="input-curr-ps-lankmark"
                          value={customerInfo && customerInfo.currPS}
                          onChange={(ev) => {
                            customerInfo.currPS =
                              ev.target.value.toLocaleUpperCase()!;
                            setCurrDo({
                              ...currDo,
                              customerInfo,
                            });
                          }}
                          placeholder="Enter Police Station"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input--curr-city"
                        >
                          CITY
                        </label>
                        <Input
                          required
                          className="form-control-alternative"
                          id="input--curr-city"
                          value={customerInfo && customerInfo.currCity}
                          onChange={(ev) => {
                            customerInfo.currCity =
                              ev.target.value.toLocaleUpperCase()!;
                            setCurrDo({
                              ...currDo,
                              customerInfo,
                            });
                          }}
                          placeholder="Enter City"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-state"
                        >
                          STATE
                        </label>
                        {states ? (
                          <Input
                            required
                            type="select"
                            name="select-state"
                            id="input-state"
                            placeholder="State"
                            value={customerInfo && customerInfo.currState}
                            onChange={(ev) => {
                              customerInfo.currState = ev.target.value!;
                              setCurrDo({
                                ...currDo,
                                customerInfo,
                              });
                            }}
                          >
                            {Object.keys(states).map((state) => {
                              return (
                                <option key={state} value={state}>
                                  {state}
                                </option>
                              );
                            })}
                          </Input>
                        ) : (
                          <Input />
                        )}
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-district"
                        >
                          DISTRICT
                        </label>
                        {states &&
                        customerInfo.currState &&
                        states[customerInfo.currState] &&
                        states[customerInfo.currState].districts ? (
                          <Input
                            required
                            type="select"
                            name="select-district"
                            id="input-district"
                            placeholder=" District"
                            value={customerInfo && customerInfo.currDistrict}
                            onChange={(ev) => {
                              customerInfo.currDistrict = ev.target.value!;
                              setCurrDo({
                                ...currDo,
                                customerInfo,
                              });
                            }}
                          >
                            {states[customerInfo.currState].districts.map(
                              (district: string) => {
                                return (
                                  <option key={district} value={district}>
                                    {district}
                                  </option>
                                );
                              }
                            )}
                          </Input>
                        ) : (
                          <Input
                            required
                            className="form-control-alternative"
                            id="input-curr-state"
                            value={customerInfo && customerInfo.currDistrict}
                            onChange={(ev) => {
                              customerInfo.currDistrict =
                                ev.target.value.toLocaleUpperCase()!;
                              setCurrDo({
                                ...currDo,
                                customerInfo,
                              });
                            }}
                            placeholder="Enter State"
                            type="text"
                          />
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-curr-postal-code"
                        >
                          POSTAL CODE
                        </label>
                        <Input
                          required
                          className="form-control-alternative"
                          id="input-curr-postal-code"
                          value={customerInfo && customerInfo.currPostal}
                          onChange={(ev) => {
                            customerInfo.currPostal =
                              ev.target.value.toLocaleUpperCase()!;
                            setCurrDo({
                              ...currDo,
                              customerInfo,
                            });
                          }}
                          placeholder="Enter Postal Code"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <Input
                            addon
                            type="checkbox"
                            aria-label="Checkbox for following text input"
                            checked={customerInfo.sameAddress === "true"}
                            onChange={(e: any) => {
                              let info = {
                                ...customerInfo,
                                sameAddress: e.target.checked!.toString(),
                              };

                              // if (e.target.checked!) {
                              //   info = {
                              //     ...info,
                              //     permLineOne: customerInfo.currLineOne || "",
                              //     permLineTwo: customerInfo.currLineTwo || "",
                              //     permCity: customerInfo.currCity || "",
                              //     permPS: customerInfo.currPS || "",
                              //     permState: customerInfo.currState || "",
                              //     permDistrict: customerInfo.currDistrict || "",
                              //     permPostal: customerInfo.currPostal || "",
                              //   };
                              // } else {
                              //   delete info.permLineOne;
                              //   delete info.permLineTwo;
                              //   delete info.permCity;
                              //   delete info.permPS;
                              //   delete info.permState;
                              //   delete info.permDistrict;
                              //   delete info.permPostal;
                              // }

                              setCurrDo({
                                ...currDo,
                                customerInfo: info,
                              });
                            }}
                          />
                        </InputGroupAddon>
                        <label
                          style={{ marginTop: "-5px", marginLeft: "10px" }}
                        >
                          Same as present address
                        </label>
                      </InputGroup>
                    </Col>
                  </Row>
                  {customerInfo.sameAddress !== "true" && (
                    <>
                      <Row>
                        <Col xs="8">
                          <h6 className="heading-small text-muted mb-4">
                            PERMANENT ADDRESS
                          </h6>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="pre-add-line-1"
                            >
                              LINE 1
                            </label>
                            <Input
                              required
                              className="form-control-alternative"
                              id="pre-add-line-1"
                              value={customerInfo && customerInfo.permLineOne}
                              onChange={(ev) => {
                                customerInfo.permLineOne =
                                  ev.target.value.toLocaleUpperCase()!;
                                setCurrDo({
                                  ...currDo,
                                  customerInfo,
                                });
                              }}
                              placeholder="Enter Address Line 1"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="pre-add-line-2"
                            >
                              LINE 2
                            </label>
                            <Input
                              required
                              className="form-control-alternative"
                              id="pre-add-line-2"
                              value={customerInfo && customerInfo.permLineTwo}
                              onChange={(ev) => {
                                customerInfo.permLineTwo =
                                  ev.target.value.toLocaleUpperCase()!;
                                setCurrDo({
                                  ...currDo,
                                  customerInfo,
                                });
                              }}
                              placeholder="Enter Address Line 2"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              CITY
                            </label>
                            <Input
                              required
                              className="form-control-alternative"
                              id="input-city"
                              value={customerInfo && customerInfo.permCity}
                              onChange={(ev) => {
                                customerInfo.permCity =
                                  ev.target.value.toLocaleUpperCase()!;
                                setCurrDo({
                                  ...currDo,
                                  customerInfo,
                                });
                              }}
                              placeholder="Enter City"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-ps-landmark"
                            >
                              PS/LANDMARK
                            </label>
                            <Input
                              required
                              className="form-control-alternative"
                              id="input-ps-lankmark"
                              value={customerInfo && customerInfo.permPS}
                              onChange={(ev) => {
                                customerInfo.permPS =
                                  ev.target.value.toLocaleUpperCase()!;
                                setCurrDo({
                                  ...currDo,
                                  customerInfo,
                                });
                              }}
                              placeholder="Enter Police Station"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-state"
                            >
                              STATE
                            </label>
                            {states ? (
                              <Input
                                required
                                type="select"
                                name="select-state"
                                id="input-state"
                                placeholder=" State"
                                value={customerInfo && customerInfo.permState}
                                onChange={(ev) => {
                                  customerInfo.permState = ev.target.value!;
                                  setCurrDo({
                                    ...currDo,
                                    customerInfo,
                                  });
                                }}
                              >
                                {Object.keys(states).map((state) => {
                                  return (
                                    <option key={state} value={state}>
                                      {state}
                                    </option>
                                  );
                                })}
                              </Input>
                            ) : (
                              <Input />
                            )}
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-district"
                            >
                              DISTRICT
                            </label>
                            {states &&
                            customerInfo.permState &&
                            states[customerInfo.permState] &&
                            states[customerInfo.permState].districts ? (
                              <Input
                                required
                                type="select"
                                name="select-district"
                                id="input-district"
                                placeholder=" District"
                                value={
                                  customerInfo && customerInfo.permDistrict
                                }
                                onChange={(ev) => {
                                  customerInfo.permDistrict = ev.target.value!;
                                  setCurrDo({
                                    ...currDo,
                                    customerInfo,
                                  });
                                }}
                              >
                                {states[customerInfo.permState].districts.map(
                                  (district: string) => {
                                    return (
                                      <option key={district} value={district}>
                                        {district}
                                      </option>
                                    );
                                  }
                                )}
                              </Input>
                            ) : (
                              <Input
                                required
                                className="form-control-alternative"
                                id="input-curr-state"
                                value={
                                  customerInfo && customerInfo.permDistrict
                                }
                                onChange={(ev) => {
                                  customerInfo.permDistrict =
                                    ev.target.value.toLocaleUpperCase()!;
                                  setCurrDo({
                                    ...currDo,
                                    customerInfo,
                                  });
                                }}
                                placeholder="Enter State"
                                type="text"
                              />
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-postal-code"
                            >
                              POSTAL CODE
                            </label>
                            <Input
                              required
                              className="form-control-alternative"
                              id="input-postal-code"
                              value={customerInfo && customerInfo.permPostal}
                              onChange={(ev) => {
                                customerInfo.permPostal =
                                  ev.target.value.toLocaleUpperCase()!;
                                setCurrDo({
                                  ...currDo,
                                  customerInfo,
                                });
                              }}
                              placeholder="Enter Postal Code"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </>
                  )}
                  <Row>
                    <Col xs="8">
                      <h6 className="heading-small text-muted mb-4">
                        BIKE DETAILS
                      </h6>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-role"
                        >
                          MODEL NAME
                        </label>
                        <Input
                          type="select"
                          name="select-model"
                          required
                          placeholder="Model Name"
                          value={currDo.modelName}
                          onChange={updateCurrModel}
                        >
                          {Object.keys(insuranceConfig).map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-role"
                        >
                          MODEL CATEGORY
                        </label>
                        <Input
                          required
                          type="select"
                          name="select-model-caregiry"
                          id="input-inquiry-type"
                          placeholder=" model-category"
                          value={
                            vehicleInfo && vehicleInfo.modelCategory //&&
                            // additionalInfo.inquiryType.toUpperCase()
                          }
                          onChange={(ev) => {
                            vehicleInfo.modelCategory =
                              ev.target.value.toLocaleUpperCase()!;
                            setCurrDo({
                              ...currDo,
                              vehicleInfo,
                            });
                          }}
                        >
                          <option value="MC">MC</option>
                          <option value="PM">PM</option>
                          <option value="SC">SC</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-frame-number"
                        >
                          FRAME NUMBER
                        </label>
                        <Input
                          required
                          className="form-control-alternative"
                          id="input-frame-number"
                          value={vehicleInfo && vehicleInfo.frameNumber}
                          onChange={(ev) => {
                            vehicleInfo.frameNumber =
                              ev.target.value.toLocaleUpperCase()!;
                            setCurrDo({
                              ...currDo,
                              vehicleInfo,
                            });
                          }}
                          placeholder="Enter Frame Number"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-engine-number"
                        >
                          ENGINE NUMBER
                        </label>
                        <Input
                          required
                          className="form-control-alternative"
                          id="input-engine-number"
                          value={vehicleInfo && vehicleInfo.engineNumber}
                          onChange={(ev) => {
                            vehicleInfo.engineNumber =
                              ev.target.value.toLocaleUpperCase()!;
                            setCurrDo({
                              ...currDo,
                              vehicleInfo,
                            });
                          }}
                          placeholder="Enter Engine Number"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-colour"
                        >
                          COLOUR
                        </label>
                        <Input
                          required
                          className="form-control-alternative"
                          id="input-colour"
                          value={vehicleInfo && vehicleInfo.color}
                          onChange={(ev) => {
                            vehicleInfo.color =
                              ev.target.value.toLocaleUpperCase()!;
                            currDo.color = ev.target.value.toLocaleUpperCase()!;
                            setCurrDo({
                              ...currDo,
                              vehicleInfo,
                            });
                          }}
                          placeholder="Enter Colour"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs="8">
                      <h6 className="heading-small text-muted mb-4">
                        ADDITIONAL DETAILS
                      </h6>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-inquiry-type"
                        >
                          INSURANCE
                        </label>
                        <Input
                          required
                          className="form-control-alternative"
                          id="input-inquiry-type"
                          value={
                            additionalInfo &&
                            additionalInfo.insuranceDeclaredValue
                          }
                          onChange={(ev) => {
                            additionalInfo.insuranceDeclaredValue =
                              ev.target.value.toLocaleUpperCase()!;
                            setCurrDo({
                              ...currDo,
                              additionalInfo,
                            });
                          }}
                          placeholder="Enter Insurance"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-financier"
                        >
                          MV TAX
                        </label>
                        <Input
                          required
                          className="form-control-alternative"
                          id="input-financier"
                          value={additionalInfo && additionalInfo.roadTaxWithRc}
                          onChange={(ev) => {
                            additionalInfo.roadTaxWithRc =
                              ev.target.value.toLocaleUpperCase()!;
                            setCurrDo({
                              ...currDo,
                              additionalInfo,
                            });
                          }}
                          placeholder="Enter Mv Tax"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-role"
                        >
                          POSTAL CHARGE
                        </label>
                        <Input
                          required
                          type="select"
                          name="select-role"
                          id="input-role"
                          placeholder="Role"
                          value={additionalInfo && additionalInfo.postalCharge}
                          onChange={(ev) => {
                            additionalInfo.postalCharge = ev.target.value!;
                            setCurrDo({
                              ...currDo,
                              additionalInfo,
                            });
                          }}
                        >
                          <option value="0">None</option>
                          {Object.values(postalCharge).map(
                            (postalCharge: any) => {
                              return (
                                <option key={postalCharge} value={postalCharge}>
                                  {postalCharge}
                                </option>
                              );
                            }
                          )}
                          {/* <option value="25">25</option>
                          <option value="250">250</option> */}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-price"
                        >
                          PRICE
                        </label>
                        <Input
                          required
                          className="form-control-alternative"
                          id="input-price"
                          value={additionalInfo && additionalInfo.price}
                          onChange={(ev) => {
                            additionalInfo.price =
                              ev.target.value.toLocaleUpperCase()!;
                            setCurrDo({
                              ...currDo,
                              additionalInfo,
                            });
                          }}
                          placeholder="Enter price"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-role"
                        >
                          HONDA ROADSIDE ASSISTANCE
                        </label>
                        <Input
                          required
                          type="select"
                          name="select-hra"
                          id="input-hra"
                          placeholder=" hra Type"
                          value={additionalInfo && additionalInfo.hra}
                          onChange={(ev) => {
                            additionalInfo.hra = ev.target.value!;
                            setCurrDo({
                              ...currDo,
                              additionalInfo,
                            });
                          }}
                        >
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-inquiry-type"
                        >
                          INQUIRY TYPE
                        </label>
                        <Input
                          required
                          type="select"
                          name="select-inquiry-type"
                          id="input-inquiry-type"
                          placeholder=" inquiry-type"
                          value={
                            additionalInfo && additionalInfo.inquiryType //&&
                            // additionalInfo.inquiryType.toUpperCase()
                          }
                          onChange={(ev) => {
                            additionalInfo.inquiryType = ev.target.value!;
                            setCurrDo({
                              ...currDo,
                              additionalInfo,
                            });
                          }}
                        >
                          <option value="we">WALK-IN INQUIRY</option>
                          <option value="te">TELEPHONE INQUIRY</option>
                          <option value="ere">EMPLOYEE INQUIRY</option>
                          <option value="fre">FINANCE INQUIRY</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-role"
                        >
                          PTFE
                        </label>
                        <Input
                          required
                          type="select"
                          name="select-ptfe"
                          id="input-ptfe"
                          placeholder=" PTFE Type"
                          value={additionalInfo && additionalInfo.ptfePolish}
                          onChange={(ev) => {
                            additionalInfo.ptfePolish = ev.target.value!;
                            setCurrDo({
                              ...currDo,
                              additionalInfo,
                            });
                          }}
                        >
                          <option value="0">None</option>
                          {Object.values(ptefCharge).map((ptefCharge: any) => {
                            return (
                              <option key={ptefCharge} value={ptefCharge}>
                                {ptefCharge}
                              </option>
                            );
                          })}
                          {/* <option value="0">NONE</option>
                          <option value="150">150</option>
                          <option value="150">500</option> */}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-role"
                        >
                          EXTENDED WARRANTY
                        </label>
                        <Input
                          type="select"
                          name="select-role"
                          id="input-role"
                          required
                          placeholder="Role"
                          value={
                            additionalInfo && additionalInfo.extendedWarranty
                          }
                          onChange={(ev) => {
                            additionalInfo.extendedWarranty =
                              ev.target.value.toLocaleUpperCase()!;
                            setCurrDo({
                              ...currDo,
                              additionalInfo,
                            });
                          }}
                        >
                          <option value="extWarrantyFourYears">4</option>
                          <option value="extWarrantySixYears">6</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-role"
                        >
                          JOY CLUB
                        </label>
                        <Input
                          required
                          type="select"
                          name="select-joyClub"
                          id="input-joyClub"
                          placeholder=" Joy Club "
                          value={additionalInfo && additionalInfo.joyClub}
                          onChange={(ev) => {
                            additionalInfo.joyClub = ev.target.value!;
                            setCurrDo({
                              ...currDo,
                              additionalInfo,
                            });
                          }}
                        >
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-role"
                        >
                          PURCHASE TYPE
                        </label>
                        <Input
                          required
                          type="select"
                          name="select-purchageType"
                          id="input-purchageType"
                          placeholder=" Purchase Type"
                          value={purchaseType}
                          onChange={(ev) => {
                            if (ev.target.value! === "cash") {
                              let info: any = currDo.additionalInfo;
                              delete info.financier;
                              // delete info.executive;
                              delete info.downPayment;

                              setCurrDo({
                                ...currDo,
                                additionalInfo: info,
                              });
                            }

                            setPurchaseType(
                              ev.target.value.toLocaleUpperCase()!
                            );
                          }}
                        >
                          <option value="cash">Cash</option>
                          <option value="finance">Finance</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  {purchaseType === "finance" && (
                    <>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-inquiry-type"
                            >
                              DOWN PAYMENT
                            </label>
                            <Input
                              required
                              className="form-control-alternative"
                              id="input-inquiry-type"
                              value={
                                additionalInfo && additionalInfo.downPayment
                              }
                              onChange={(ev) => {
                                additionalInfo.downPayment =
                                  ev.target.value.toLocaleUpperCase()!;
                                setCurrDo({
                                  ...currDo,
                                  additionalInfo,
                                });
                              }}
                              placeholder="Enter Down Payment"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-financier"
                            >
                              FINANCIER NAME
                            </label>
                            {/* <Input
                              required
                              className="form-control-alternative"
                              id="input-financier"
                              value={additionalInfo && additionalInfo.financier}
                              onChange={(ev) => {
                                additionalInfo.financier = ev.target.value.toLocaleUpperCase()!;
                                setCurrDo({
                                  ...currDo,
                                  additionalInfo,
                                });
                              }}
                              placeholder="Enter Financier Name"
                              type="text"
                            /> */}

                            <Input
                              required
                              type="select"
                              name="select-financer"
                              id="input-financer"
                              placeholder="Select Financer"
                              value={additionalInfo && additionalInfo.financier}
                              onChange={(ev) => {
                                additionalInfo.financier = ev.target.value!;
                                setCurrDo({
                                  ...currDo,
                                  additionalInfo,
                                });
                              }}
                            >
                              <option value="COOPERATIVE BANK">
                                COOPERATIVE BANK
                              </option>
                              <option value="ICICI BANK">ICICI BANK</option>
                              <option value="AU BANK">AU BANK</option>
                              <option value="DEALER OWNED FINANCE">
                                DEALER OWNED FINANCE
                              </option>
                              <option value="GOVERNMENT BANK">
                                GOVERNMENT BANK
                              </option>
                              <option value="GRAMIN BANK">GRAMIN BANK</option>
                              <option value="L&T FINANCIAL SERVICES">
                                L&T FINANCIAL SERVICES
                              </option>
                              <option value="CHOLA MURUGAPPA">
                                CHOLA MURUGAPPA
                              </option>
                              <option value="HDFC BANK">HDFC BANK</option>
                              <option value="HOME CREDIT">HOME CREDIT</option>
                              <option value="Hinduja Leyland Finance Ltd">
                                Hinduja Leyland Finance Ltd
                              </option>
                              <option value="IDFC FIRST BANK">
                                IDFC FIRST BANK
                              </option>
                              <option value="Induslnd">Induslnd</option>
                              <option value="Panjab National Bank">
                                Panjab National Bank
                              </option>
                              <option value="SBI">SBI</option>
                              <option value="Shri Ram Finance">
                                Shri Ram Finance
                              </option>
                              <option value="TATA CAPITAL">TATA CAPITAL</option>
                              <option value="Muthoot Finance">
                                Muthoot Finance
                              </option>
                              <option value="OTHERS">OTHERS</option>

                              {/* <option value="0">NONE</option>
                          <option value="150">150</option>
                          <option value="150">500</option> */}
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-executive "
                            >
                              EXECUTIVE NAME
                            </label>
                            <Input
                              required
                              className="form-control-alternative"
                              id="input-executive "
                              value={additionalInfo && additionalInfo.executive}
                              onChange={(ev) => {
                                additionalInfo.executive =
                                  ev.target.value.toLocaleUpperCase()!;
                                setCurrDo({
                                  ...currDo,
                                  additionalInfo,
                                });
                              }}
                              placeholder="Enter Executive  Name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-financier"
                            >
                              SALE TYPE
                            </label>
                            {/* <Input
                              required
                              className="form-control-alternative"
                              id="input-financier"
                              value={additionalInfo && additionalInfo.financier}
                              onChange={(ev) => {
                                additionalInfo.financier = ev.target.value.toLocaleUpperCase()!;
                                setCurrDo({
                                  ...currDo,
                                  additionalInfo,
                                });
                              }}
                              placeholder="Enter Financier Name"
                              type="text"
                            /> */}

                            <Input
                              required
                              type="select"
                              name="select-financer"
                              id="input-financer"
                              placeholder="Select Financer"
                              value={additionalInfo && additionalInfo.saleType}
                              onChange={(ev) => {
                                additionalInfo.saleType = ev.target.value!;
                                setCurrDo({
                                  ...currDo,
                                  additionalInfo,
                                });
                              }}
                            >
                              <option value="Counter Sale">Counter Sale</option>
                              <option value="Non-Counter Sale">
                                Non-Counter Sale
                              </option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                    </>
                  )}

                  <Row>
                    <Col lg="12">
                      <label
                        className="form-control-label"
                        htmlFor="input-colour"
                      >
                        ACCESSORIES LIST
                      </label>

                      <Table className="table table-striped table-bordered my-3">
                        <thead className="thead-light">
                          <tr>
                            <th scope="col" className="text-center">
                              SELECT
                            </th>
                            <th scope="col">NAME</th>
                            <th scope="col">PRICE</th>

                            {/* <th scope="col">Status</th> */}
                            {/* <th scope="col">Action</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {accessories &&
                            Object.keys(accessories).map((accessory: any) => (
                              <tr key={accessory}>
                                <td scope="row" className="text-center">
                                  <Input
                                    className="checkbox"
                                    checked={
                                      !!(
                                        currDo &&
                                        currDo.additionalInfo &&
                                        currDo.additionalInfo.accessoriesList &&
                                        currDo.additionalInfo.accessoriesList[
                                          accessory
                                        ]
                                      )
                                    }
                                    onChange={(e: any) => {
                                      if (currDo && currDo.additionalInfo) {
                                        let total: number =
                                          parseInt(
                                            currDo.additionalInfo.accessories
                                          ) || 0;
                                        let accessoriesList: any =
                                          currDo.additionalInfo
                                            .accessoriesList || {};

                                        if (!!accessoriesList[accessory]) {
                                          total -= parseInt(
                                            accessoriesList[accessory]
                                          );

                                          delete accessoriesList[accessory];
                                        } else {
                                          total += parseInt(
                                            accessories[accessory]
                                          );

                                          accessoriesList[accessory] =
                                            accessories[accessory];
                                        }

                                        setCurrDo({
                                          ...currDo,
                                          additionalInfo: {
                                            ...currDo.additionalInfo,
                                            accessories: total.toString(),
                                            accessoriesList: accessoriesList,
                                          },
                                        });
                                      }
                                    }}
                                    type="checkbox"
                                  />
                                </td>
                                <td>{accessory}</td>
                                <td>{accessories[accessory]}</td>
                                {/* {/* <td>{total}</td> */}
                              </tr>
                            ))}
                          <tr>
                            <td></td>
                            <td>
                              <b>TOTAL </b>
                            </td>
                            <td>
                              <b>
                                {currDo.additionalInfo
                                  ? currDo.additionalInfo.accessories
                                  : 0}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  } else {
    return <></>;
  }
};

export default EditDo;

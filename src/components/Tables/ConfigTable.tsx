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
import React, { useState, useEffect } from "react";
import Papa from "papaparse";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Table,
  Collapse,
  InputGroup,
  InputGroupAddon,
  Label,
  CustomInput,
} from "reactstrap";
import firebase from "firebase/app";
import "firebase/firestore";
// core components
import Header from "../../components/Headers/Header";
import { withFadeIn } from "../../components/HOC/withFadeIn";
import Loading from "../Share/Loading";

interface ConfigRow {
  [key: string]: string;
}

export interface Config {
  [key: string]: ConfigRow;
}

interface TableProps {
  title: string;
  config: Config;
  headers: string[];
  formatDownloadLink: string;
  onSave: (config: Config) => void;
}

const ConfigTable: React.FC<TableProps> = (props) => {
  const { title, config, headers, formatDownloadLink, onSave } = props;
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [newKey, setNewKey] = useState<string>();
  const [currConfig, setCurrConfig] = useState<Config>({});
  const [fileInputKey, setFileInputKey] = useState(new Date().toString());
  const [bulkUploadError, setBulkUploadError] = useState<string>();

  const camelCaseToReadable = (text: string): string => {
    return (
      text
        // insert a space before all caps
        .replace(/([A-Z])/g, " $1")
        // uppercase the first character
        .replace(/^./, function (str) {
          return str.toUpperCase();
        })
    );
  };

  useEffect(() => {
    if (config === null || Object.keys(config).length) {
      setCurrConfig(config);
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    if (!loading) {
      setDisabled(false);
    }
  }, [loading]);

  const handleChange = (key: string, header: string, value: string) => {
    const tempCurrConfig = { ...currConfig };
    tempCurrConfig[key][header] = value;
    setCurrConfig(tempCurrConfig);
  };

  const addRow = (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (newKey) {
      const tempCurrConfig: any = { ...currConfig };
      tempCurrConfig[newKey] = {};

      setNewKey("");
      setCurrConfig(tempCurrConfig);
    }
  };

  const removeRow = (key: string) => {
    const tempCurrConfig: any = { ...currConfig };
    delete tempCurrConfig[key];
    setCurrConfig(tempCurrConfig);
  };

  const readFile = (ev: React.SyntheticEvent) => {
    const target = ev.target as HTMLInputElement;
    const files = target.files!;

    Papa.parse(files[0], {
      header: true,
      complete: function (results) {
        let tempCurrConfig: any = {};
        let error: string | null = null;

        try {
          results.data.forEach((entry: any) => {
            if (Object.keys(entry).length !== headers.length + 1) {
              throw "Incorrect format";
            }
            tempCurrConfig[entry["MODEL NAME"]] = {};
            headers.forEach((header) => {
              tempCurrConfig[entry["MODEL NAME"]][header] =
                entry[camelCaseToReadable(header).toUpperCase()];
            });
          });
        } catch (err) {
          error = err;
        }

        if (error === null) {
          setCurrConfig(tempCurrConfig);
        } else {
          setFileInputKey(new Date().toString());
          setBulkUploadError(
            "Something went wrong, please try again. Tip: check the file format."
          );
        }
      },
    });
  };

  return (
    <Form
      onSubmit={(ev) => {
        ev.preventDefault();

        onSave(currConfig);
        setBulkUploadError("");
        setFileInputKey(new Date().toString());
        setIsOpen(false);
      }}
    >
      <Row>
        <Col xs="8">
          <h6 className="heading-small text-muted my-2">{title}</h6>
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
              Edit
            </Button>
          ) : (
            <>
              <Button
                className="small-button-width my-2"
                color={"danger"}
                onClick={(e) => {
                  setCurrConfig(config);
                  setBulkUploadError("");
                  setFileInputKey(new Date().toString());
                  setIsOpen(false);
                }}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                className="small-button-width my-2"
                color={"success"}
                type="submit"
                size="sm"
              >
                Save
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
          currConfig && (
            <>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th key="modelName" scope="col">
                      Model Name
                    </th>
                    {headers.map((header) => (
                      <th key={header} scope="col">
                        {camelCaseToReadable(header)}
                      </th>
                    ))}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(currConfig).map((key: string) => (
                    <tr key={key}>
                      <th scope="row">{key}</th>
                      {currConfig[key] &&
                        headers.map((header: string) => (
                          <td key={`input-${header}`}>
                            <Input
                              required
                              disabled={disabled}
                              value={currConfig[key][header] || ""}
                              onChange={(ev) => {
                                handleChange(key, header, ev.target.value!);
                              }}
                            />
                          </td>
                        ))}
                      <td>
                        <Button
                          size="sm"
                          color="danger"
                          onClick={() => removeRow(key)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <hr className="my-4" />
            </>
          )
        )}
        <Row>
          <Col sm={{ size: 6, offset: 3 }} className="text-center">
            <InputGroup>
              <Input
                value={newKey}
                placeholder="Model name"
                onChange={(ev) => setNewKey(ev.target.value!.toUpperCase())}
                disabled={disabled}
              />
              <InputGroupAddon addonType="append">
                <Button color="primary" onClick={addRow} disabled={disabled}>
                  Add row
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col sm={{ size: 6, offset: 3 }} className="text-center">
            <FormGroup>
              <Label for="formatFile">
                Bulk upload config (Download the format file{" "}
                <a href={formatDownloadLink} download>
                  here
                </a>
                )
              </Label>
              <CustomInput
                type="file"
                id="formatFile"
                name="formatFile"
                label="Choose file"
                onChange={readFile}
                key={fileInputKey}
                disabled={disabled}
              />
            </FormGroup>
            {bulkUploadError && (
              <small className="text-danger">{bulkUploadError}</small>
            )}
          </Col>
        </Row>
        <hr className="my-4" />
      </Collapse>
    </Form>
  );
};

export default ConfigTable;

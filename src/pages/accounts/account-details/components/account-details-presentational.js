import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Tour, Tooltip, Checkbox } from "antd";
import "../styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_IP } from "assets/Config";
import { getApi } from "redux/sagas/getApiDataSaga";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const AccountPresentational = () => {
  // const [activeTab, setActiveTab] = useState("overview");
  // const [isDetailsVisible, setIsDetailsVisible] = useState(true);
  const { accountId } = useParams();
  const globalRedux = useSelector((state) => state.globalRedux);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (accountId) {
      let url = `${SERVER_IP}account/${accountId}`;
      dispatch(getApi("GET_ACCOUNT_BOOKS_BY_ID", url));
    }
  }, [accountId]);

  const accountData = {
    accountOwner: globalRedux?.accountBooksData?.account_owner_name,
    account_name: globalRedux?.accountBooksData?.account_name,
    account_site: globalRedux?.accountBooksData?.account_site,
    parent_account: globalRedux?.accountBooksData?.parent_account,
    account_number: globalRedux?.accountBooksData?.account_number,
    account_type: globalRedux?.accountBooksData?.account_type,
    industry: globalRedux?.accountBooksData?.industry,
    annual_revenue: globalRedux?.accountBooksData?.annual_revenue,
    modifiedBy: globalRedux?.accountBooksData?.account_owner_name,
    modifiedDate: globalRedux?.accountBooksData?.updatedAt,
    rating: globalRedux?.accountBooksData?.rating,
    phone: globalRedux?.accountBooksData?.phone,
    email: globalRedux?.accountBooksData?.email,
    fax: globalRedux?.accountBooksData?.fax,
    website: globalRedux?.accountBooksData?.website,
    ticker_symbol: globalRedux?.accountBooksData?.ticker_symbol,
    ownership: globalRedux?.accountBooksData?.ownership,
    employees: globalRedux?.accountBooksData?.employees,
    sic_code: globalRedux?.accountBooksData?.sic_code,
    createdBy: globalRedux?.accountBooksData?.account_owner_name,
    createdDate: globalRedux?.accountBooksData?.createdAt,
    billing_street: globalRedux?.accountBooksData?.billing_street,
    billing_city: globalRedux?.accountBooksData?.billing_city,
    billing_state: globalRedux?.accountBooksData?.billing_state,
    billing_zip_code: globalRedux?.accountBooksData?.billing_zip_code,
    billing_country: globalRedux?.accountBooksData?.billing_country,
    shipping_street: globalRedux?.accountBooksData?.shipping_street,
    shipping_city: globalRedux?.accountBooksData?.shipping_city,
    shipping_state: globalRedux?.accountBooksData?.shipping_state,
    shipping_zip_code: globalRedux?.accountBooksData?.shipping_zip_code,
    shipping_country: globalRedux?.accountBooksData?.shipping_country,
    description: globalRedux?.accountBooksData?.description,
  };

  // const toggleDetails = () => {
  //   setIsDetailsVisible(!isDetailsVisible);
  // };
  return (
    <>
      <Col className="account_container">
        <div className="account-details">
          <div
            className="account-details__header"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
              ←
            </div>
            <div>Account Details</div>
          </div>

          <div className="account-details__content">
            {/* account Information Section */}
            <div className="account-details__section">
              <h3 className="account-details__section-title">
                Account Information
              </h3>
              <div className="account-details__grid">
                <div className="account-details__column">
                  <div className="account-field">
                    <label className="account-field__label">
                      Account Owner
                    </label>
                    <div className="account-field__value">
                      {accountData.accountOwner}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">Account Name</label>
                    <div className="account-field__value">
                      {accountData.account_name}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">Account Site</label>
                    <div className="account-field__value account-field__value--phone">
                      {accountData.account_site}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">Parent Account</label>
                    <div className="account-field__value account-field__value--phone">
                      {accountData.parent_account}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">
                      Account Number
                    </label>
                    <div className="account-field__value">
                      {accountData.account_number}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">Account Type</label>
                    <div className="account-field__value">
                      {accountData.account_type}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">
                     Industry
                    </label>
                    <div className="account-field__value">
                      {accountData.industry}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">
                     Annual Revenue
                    </label>
                    <div className="account-field__value">
                      {accountData.annual_revenue}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">Created By</label>
                    <div className="account-field__value account-field__value--with-date">
                      <div>{accountData.createdBy}</div>
                      <div className="account-field__date">
                        {dayjs(accountData.createdDate).format(
                          "DD-MM-YYYY HH:mm"
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="account-details__column">
                  <div className="account-field">
                    <label className="account-field__label">Rating</label>
                    <div className="account-field__value">
                      {accountData.rating}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">Phone</label>
                    <div className="account-field__value">
                      {accountData.phone}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">Fax</label>
                    <div className="account-field__value account-field__value--email">
                      {accountData.fax}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">Website</label>
                    <div className="account-field__value">
                      {accountData.website}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">Ticker Symbol</label>
                    <div className="account-field__value account-field__value--link">
                      {accountData.ticker_symbol}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">
                      Ownership
                    </label>
                    <div className="account-field__value">
                      {accountData.ownership}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">
                     Employees
                    </label>
                    <div className="account-field__value">
                      {accountData.employees}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">SIC Code</label>
                    <div className="account-field__value">
                      {accountData.sic_code}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">Modified By</label>
                    <div className="account-field__value account-field__value--with-date">
                      <div>{accountData.modifiedBy}</div>
                      <div className="account-field__date">
                        {dayjs(accountData.modifiedDate).format(
                          "DD-MM-YYYY HH:mm"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="account-details__section">
              <h3 className="account-details__section-title">
                Address Information
              </h3>
              <div className="account-details__grid">
                <div className="account-details__column">
                  <div className="account-field">
                    <label className="account-field__label">
                      Billing Street
                    </label>
                    <div className="account-field__value">
                      {accountData.billing_street}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">Billing City</label>
                    <div className="account-field__value">
                      {accountData.billing_city}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">
                      Billing State
                    </label>
                    <div className="account-field__value">
                      {accountData.billing_state}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">Billing Zip</label>
                    <div className="account-field__value">
                      {accountData.billing_zip_code}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">
                      {" "}
                      Billing Country
                    </label>
                    <div className="account-field__value">
                      {accountData.billing_country}
                    </div>
                  </div>
                </div>
                <div className="account-details__column">
                  <div className="account-field">
                    <label className="account-field__label">
                      Shipping Street
                    </label>
                    <div className="account-field__value">
                      {accountData.shipping_street}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">
                      Shipping City
                    </label>
                    <div className="account-field__value">
                      {accountData.shipping_city}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">
                      Shipping State
                    </label>
                    <div className="account-field__value">
                      {accountData.shipping_state}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">Shipping Zip</label>
                    <div className="account-field__value">
                      {accountData.shipping_zip_code}
                    </div>
                  </div>
                  <div className="account-field">
                    <label className="account-field__label">
                      Shipping Country
                    </label>
                    <div className="account-field__value">
                      {accountData.shipping_country}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Information Section */}
            <div className="account-details__section">
              <h3 className="account-details__section-title">
                Description Information
              </h3>
              <div className="account-field">
                <label className="account-field__label">Description</label>
                <div className="account-field__value">
                  {accountData.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default AccountPresentational;

import React, { useEffect } from "react";
import { Col } from "antd";
import "../styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_IP } from "assets/Config";
import { getApi } from "redux/sagas/getApiDataSaga";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

const displayValue = (value) => {
  return value && String(value).trim() !== "" ? value : "-";
};

const formatDate = (value) => {
  return value ? dayjs(value).format("DD-MM-YYYY HH:mm") : "-";
};

const AccountPresentational = () => {
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
    modifiedBy: globalRedux?.accountBooksData?.updated_by_name,
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
    createdBy: globalRedux?.accountBooksData?.created_by_name,
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

  return (
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
          {/* Account Information Section */}
          <div className="account-details__section">
            <h3 className="account-details__section-title">
              Account Information
            </h3>
            <div className="account-details__grid">
              <div className="account-details__column">
                <div className="account-field">
                  <label className="account-field__label">Account Owner</label>
                  <div className="account-field__value">
                    {displayValue(accountData.accountOwner)}
                  </div>
                </div>
                <div className="account-field">
                  <label className="account-field__label">Account Name</label>
                  <div className="account-field__value">
                    {displayValue(accountData.account_name)}
                  </div>
                </div>
                <div className="account-field">
                  <label className="account-field__label">Created By</label>
                  <div className="account-field__value account-field__value--with-date">
                    <div>{displayValue(accountData.createdBy)}</div>
                    <div className="account-field__date">
                      {formatDate(accountData.createdDate)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="account-details__column">
                <div className="account-field">
                  <label className="account-field__label">Phone</label>
                  <div className="account-field__value">
                    {displayValue(accountData.phone)}
                  </div>
                </div>
                <div className="account-field">
                  <label className="account-field__label">Website</label>
                  <div className="account-field__value">
                    {displayValue(accountData.website)}
                  </div>
                </div>
                <div className="account-field">
                  <label className="account-field__label">Employees</label>
                  <div className="account-field__value">
                    {displayValue(accountData.employees)}
                  </div>
                </div>
                <div className="account-field">
                  <label className="account-field__label">Modified By</label>
                  <div className="account-field__value account-field__value--with-date">
                    <div>{displayValue(accountData.modifiedBy)}</div>
                    <div className="account-field__date">
                      {formatDate(accountData.modifiedDate)}
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
                  <label className="account-field__label">Billing Street</label>
                  <div className="account-field__value">
                    {displayValue(accountData.billing_street)}
                  </div>
                </div>
                <div className="account-field">
                  <label className="account-field__label">Billing City</label>
                  <div className="account-field__value">
                    {displayValue(accountData.billing_city)}
                  </div>
                </div>
                <div className="account-field">
                  <label className="account-field__label">Billing State</label>
                  <div className="account-field__value">
                    {displayValue(accountData.billing_state)}
                  </div>
                </div>
                <div className="account-field">
                  <label className="account-field__label">Billing Zip</label>
                  <div className="account-field__value">
                    {displayValue(accountData.billing_zip_code)}
                  </div>
                </div>
                <div className="account-field">
                  <label className="account-field__label">
                    Billing Country
                  </label>
                  <div className="account-field__value">
                    {displayValue(accountData.billing_country)}
                  </div>
                </div>
              </div>

              <div className="account-details__column">
                <div className="account-field">
                  <label className="account-field__label">
                    Shipping Street
                  </label>
                  <div className="account-field__value">
                    {displayValue(accountData.shipping_street)}
                  </div>
                </div>
                <div className="account-field">
                  <label className="account-field__label">Shipping City</label>
                  <div className="account-field__value">
                    {displayValue(accountData.shipping_city)}
                  </div>
                </div>
                <div className="account-field">
                  <label className="account-field__label">Shipping State</label>
                  <div className="account-field__value">
                    {displayValue(accountData.shipping_state)}
                  </div>
                </div>
                <div className="account-field">
                  <label className="account-field__label">Shipping Zip</label>
                  <div className="account-field__value">
                    {displayValue(accountData.shipping_zip_code)}
                  </div>
                </div>
                <div className="account-field">
                  <label className="account-field__label">
                    Shipping Country
                  </label>
                  <div className="account-field__value">
                    {displayValue(accountData.shipping_country)}
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
                {displayValue(accountData.description)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default AccountPresentational;

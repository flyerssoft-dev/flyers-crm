import React, { useEffect } from "react";
import { Col } from "antd";
import "../styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_IP } from "assets/Config";
import { getApi } from "redux/sagas/getApiDataSaga";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

const DealPresentational = () => {
  const { dealId } = useParams();
  const dealsRedux = useSelector((state) => state.dealsRedux);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (dealId) {
      const url = `${SERVER_IP}deals/${dealId}`;
      dispatch(getApi("GET_DEAL_BY_ID", url));
    }
  }, [dealId]);

  const displayValue = (value) => {
    return value && String(value).trim() !== "" ? value : "-";
  };

  const formatDate = (date, format = "DD-MM-YYYY HH:mm") => {
    return date ? dayjs(date).format(format) : "-";
  };

  const dealData = {
    dealOwner: dealsRedux?.dealData?.deal_owner_name,
    deal_name: dealsRedux?.dealData?.deal_name,
    account_name: dealsRedux?.dealData?.account_name,
    type: dealsRedux?.dealData?.type,
    next_step: dealsRedux?.dealData?.next_step,
    lead_resource: dealsRedux?.dealData?.lead_resource,
    contact_name: dealsRedux?.dealData?.contact_name,
    amount: dealsRedux?.dealData?.amount,
    modifiedBy: dealsRedux?.dealData?.deal_owner_name,
    modifiedDate: dealsRedux?.dealData?.updatedAt,
    closing_date: dealsRedux?.dealData?.closing_date,
    stage: dealsRedux?.dealData?.stage,
    probability: dealsRedux?.dealData?.probability,
    expected_revenue: dealsRedux?.dealData?.expected_revenue,
    campaign_source: dealsRedux?.dealData?.campaign_source,
    createdBy: dealsRedux?.dealData?.deal_owner_name,
    createdDate: dealsRedux?.dealData?.createdAt,
    description: dealsRedux?.dealData?.description,
  };

  return (
    <Col className="deal_container">
      <div className="deal-details">
        <div
          className="deal-details__header"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
            ←
          </div>
          <div>Deal Details</div>
        </div>

        <div className="deal-details__content">
          {/* Deal Information Section */}
          <div className="deal-details__section">
            <h3 className="deal-details__section-title">Deal Information</h3>
            <div className="deal-details__grid">
              <div className="deal-details__column">
                <div className="deal-field">
                  <label className="deal-field__label">Deal Owner</label>
                  <div className="deal-field__value">
                    {displayValue(dealData.dealOwner)}
                  </div>
                </div>
                <div className="deal-field">
                  <label className="deal-field__label">Deal Name</label>
                  <div className="deal-field__value">
                    {displayValue(dealData.deal_name)}
                  </div>
                </div>
                <div className="deal-field">
                  <label className="deal-field__label">Account Name</label>
                  <div className="deal-field__value deal-field__value--phone">
                    {displayValue(dealData.account_name)}
                  </div>
                </div>
                <div className="deal-field">
                  <label className="deal-field__label">Contact Name</label>
                  <div className="deal-field__value">
                    {displayValue(dealData.contact_name)}
                  </div>
                </div>
                <div className="deal-field">
                  <label className="deal-field__label">Modified By</label>
                  <div className="deal-field__value deal-field__value--with-date">
                    <div>{displayValue(dealData.modifiedBy)}</div>
                    <div className="deal-field__date">
                      {formatDate(dealData.modifiedDate)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="deal-details__column">
                <div className="deal-field">
                  <label className="deal-field__label">Amount</label>
                  <div className="deal-field__value">
                    {displayValue(dealData.amount)}
                  </div>
                </div>
                <div className="deal-field">
                  <label className="deal-field__label">Closing Date</label>
                  <div className="deal-field__value">
                    {formatDate(dealData.closing_date, "DD-MM-YYYY")}
                  </div>
                </div>
                <div className="deal-field">
                  <label className="deal-field__label">Stage</label>
                  <div className="deal-field__value deal-field__value--email">
                    {displayValue(dealData.stage)}
                  </div>
                </div>
                <div className="deal-field">
                  <label className="deal-field__label">Created By</label>
                  <div className="deal-field__value deal-field__value--with-date">
                    <div>{displayValue(dealData.createdBy)}</div>
                    <div className="deal-field__date">
                      {formatDate(dealData.createdDate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Information Section */}
          <div className="deal-details__section">
            <h3 className="deal-details__section-title">
              Description Information
            </h3>
            <div className="deal-field">
              <label className="deal-field__label">Description</label>
              <div className="deal-field__value">
                {displayValue(dealData.description)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default DealPresentational;

"use client";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./pipeline.scss";
import { Col, Row } from "antd";
import moment from "moment";
import { useDispatch } from "react-redux";
import { putApi } from "redux/sagas/putApiSaga";
import { SERVER_IP } from "assets/Config";

const stageList = [
  "Technical/Demo",
  "RFP",
  "Proposal/Price Quote",
  "Negotiation/Review",
  "On Hold",
  "Closed Won",
  "Closed Lost",
];

export default function Pipelines({ dealData,  refreshList , navigate }) {
  const [data, setData] = useState({ stages: [] });
  const dispatch = useDispatch();

  // Build stages dynamically from dealData
  useEffect(() => {
    if (dealData && Array.isArray(dealData)) {
      const stages = stageList.map((stageName, i) => ({
        id: `stage-${i + 1}`,
        title: stageName,
        deals: dealData
          .filter((d) => d.stage === stageName)
          .map((d) => ({
            id: d.id,
            name: d.deal_name,
            contact: d.contact_name,
            amount: `₹${d.amount}.00`,
            date: d.closing_date || "—",
          })),
      }));
      setData({ stages });
    }
  }, [dealData]);


  const onDragEnd = (result) => {
    const { source, destination ,draggableId } = result;

    console.log("Drag Result:", result);
    if (!destination) return;

    const sourceStageIndex = data.stages.findIndex(
      (stage) => stage.id === source.droppableId
    );
    const destStageIndex = data.stages.findIndex(
      (stage) => stage.id === destination.droppableId
    );

    const sourceStage = { ...data.stages[sourceStageIndex] };
    const destStage = { ...data.stages[destStageIndex] };

    
    const sourceDeals = Array.from(sourceStage.deals);
    const [movedDeal] = sourceDeals.splice(source.index, 1);
    
    if (sourceStage.id === destStage.id) {
      sourceDeals.splice(destination.index, 0, movedDeal);
      sourceStage.deals = sourceDeals;
      
      const newStages = [...data.stages];
      newStages[sourceStageIndex] = sourceStage;
      
      setData({ stages: newStages });
    } else {
      const destDeals = Array.from(destStage.deals);
      destDeals.splice(destination.index, 0, movedDeal);

      sourceStage.deals = sourceDeals;
      destStage.deals = destDeals;

      const newStages = [...data.stages];
      newStages[sourceStageIndex] = sourceStage;
      newStages[destStageIndex] = destStage;

      const payload = {
        stage: destStage.title,
      };

      dispatch(putApi(payload, "MOVE_DEAL", `${SERVER_IP}deals/${draggableId}`));
      refreshList()

      setData({ stages: newStages });
    }
  };

  return (
    <Row>
      <Col xl={24}>
        <div className="kanban-board">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="kanban-stages">
              {data.stages.map((stage) => (
                <Droppable key={stage.id} droppableId={stage.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="kanban-stage"
                    >
                      <div className="stage-header">
                        <h2>{stage.title}</h2>
                        <p>
                          ₹
                          {stage.deals.reduce(
                            (sum, d) => sum + parseFloat(d.amount.replace("₹", "").replace(".00", "")),
                            0
                          )}
                          .00 • {stage.deals.length} Deals
                        </p>
                      </div>

                      <div className="stage-body">
                        {stage.deals.length === 0 && (
                          <p className="empty">This stage is empty</p>
                        )}
                        {stage.deals.map((deal, index) => (
                          <Draggable
                            key={deal.id}
                            draggableId={deal.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`deal-card ${
                                  snapshot.isDragging ? "dragging" : ""
                                }`}
                                onClick={() => navigate(`/pipeline/${deal.id}`)}
                              >
                                <p className="deal-title">{deal.name}</p>
                                <p className="deal-contact">{deal.contact}</p>
                                <div className="deal-footer">
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#757575",
                                    }}
                                  >
                                    {deal.amount}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#0288d1",
                                    }}
                                  >
                                    {moment(deal.date).format("DD MMM")}
                                  </span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      </Col>
    </Row>
  );
}

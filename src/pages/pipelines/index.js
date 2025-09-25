"use client";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./pipeline.scss";
import { Col, Row } from "antd";

const initialData = {
  stages: [
    {
      id: "stage-1",
      title: "Technical/Demo",
      deals: [
        {
          id: "deal-1",
          name: "Deal for Sutharsan",
          contact: "Sutharsan Parthasaarat",
          amount: "₹0.00",
          date: "Oct 03",
        },
        {
          id: "deal-2",
          name: "Deal for Navya",
          contact: "Navya Raghuram",
          amount: "₹0.00",
          date: "Tomorrow",
        },
      ],
    },
    {
      id: "stage-2",
      title: "RFP",
      deals: [
        {
          id: "deal-3",
          name: "Deal for Pradeep",
          contact: "Pradeep Kumar",
          amount: "₹0.00",
          date: "Sep 08",
        },
      ],
    },
    { id: "stage-3", title: "Proposal/Price Quote", deals: [] },
    { id: "stage-4", title: "Negotiation/Review", deals: [] },
    { id: "stage-5", title: "On Hold", deals: [] },
    { id: "stage-6", title: "Closed Won", deals: [] },
    { id: "stage-7", title: "Closed Lost", deals: [] },
  ],
};

export default function Pipelines() {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result) => {
    const { source, destination } = result;
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
                        <p>₹0.00 • {stage.deals.length} Deals</p>
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
                                    {deal.date}
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

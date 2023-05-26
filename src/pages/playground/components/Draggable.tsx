import { initialState } from "./initialState";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface ChapterProps {
  name?: string;
  id: string;
  content?: string;
  index: number;
}

interface JourneyProps {
  id: string;
  title: string;
  chapters: ChapterProps[];
}

const Chapter = ({ id, content, index }: ChapterProps) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          id={id}
          className="border-black  border-2 p-4 w-full h-fit text-lg"
          draggable
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          {content}
        </div>
      )}
    </Draggable>
  );
};

const Journey = ({ id, title, chapters }: JourneyProps) => {
  return (
    <div className="border-black border-2 flex flex-col p-4 gap-6 w-fit h-fit">
      <h2 className="text-2xl">{title}</h2>
      <Droppable droppableId={id}>
        {(provided) => {
          return (
            <div
              id={id}
              className="flex flex-col gap-2 w-full h-full"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {chapters.map((chapter, index) => {
                return (
                  <div key={chapter.id}>
                    <Chapter
                      id={chapter.id}
                      content={chapter.content}
                      index={index}
                    />
                    {provided.placeholder}
                  </div>
                );
              })}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

const Dragging = () => {
  const [dragState, setDragState] = useState(initialState);
  const onDragEnd = () => {
    //to do
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-row gap-6">
        {dragState.journeys.map((journey, index) => {
          const chapters = journey.chapters.map((chapterID) => {
            return dragState.chapters.find(
              (chapter) => chapter.id === chapterID
            );
          });

          const chapterProps = chapters.map((chapter) => {
            return {
              id: chapter === undefined ? "" : chapter.id,
              name: chapter === undefined ? "" : chapter.name,
              content: chapter?.content,
              index: 0,
            } as ChapterProps;
          });

          return (
            <Journey
              key={index}
              id={journey.id}
              title={journey.title}
              chapters={chapterProps}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default Dragging;

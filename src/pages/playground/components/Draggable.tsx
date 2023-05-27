import { initialState } from "./initialState";
import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";

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
    <div className="border-black border-2 flex flex-col p-4 gap-6 min-w-[400px] w-fit min-h-[400px] h-fit">
      <h2 className="text-2xl">{title}</h2>
      <StrictModeDroppable droppableId={id}>
        {(provided) => {
          return (
            <div
              id={id}
              className="flex grow flex-col gap-2 w-full h-full"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {chapters.map((chapter, index) => {
                return (
                  <Chapter
                    key={chapter.id}
                    id={chapter.id}
                    content={chapter.content}
                    index={index}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </StrictModeDroppable>
    </div>
  );
};

const Dragging = () => {
  const [dragState, setDragState] = useState(initialState);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // If there is no destination or the item is dropped in the same position, do nothing
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    const updatedJourneys = Array.from(dragState.journeys);
    const sourceJourney = updatedJourneys.find(
      (journey) => journey.id === source.droppableId
    );
    const destinationJourney = updatedJourneys.find(
      (journey) => journey.id === destination.droppableId
    );

    // Move the chapter within the same journey
    if (sourceJourney && source.droppableId === destination.droppableId) {
      const chapters = Array.from(sourceJourney.chapters);
      const [movedChapter] = chapters.splice(source.index, 1);
      chapters.splice(destination.index, 0, movedChapter);
      sourceJourney.chapters = chapters;
    }
    // Move the chapter to a different journey
    else if (sourceJourney && destinationJourney) {
      const sourceChapters = Array.from(sourceJourney.chapters);
      const destinationChapters = Array.from(destinationJourney.chapters);
      const [movedChapter] = sourceChapters.splice(source.index, 1);
      destinationChapters.splice(destination.index, 0, movedChapter);
      sourceJourney.chapters = sourceChapters;
      destinationJourney.chapters = destinationChapters;
    }

    setDragState({
      ...dragState,
      journeys: updatedJourneys,
    });
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
              index,
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

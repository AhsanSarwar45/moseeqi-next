import { Box } from "@chakra-ui/react";
import { selectLastSelectedTrack, selectTracks, useStore } from "@Data/Store";
import { GetPixelsPerSecond } from "@Utility/TimeUtils";
import React, { useEffect, useRef } from "react";
import PianoRollPartView from "./PianoRollPartView";

interface GridViewProps {
    basePixelsPerSecond: number;
    columnWidth: number;
    gridHeight: number;
    gridCellHeight: number;
    isSnappingOn: boolean;
    snapWidth: number;
}

const GridView = (props: GridViewProps) => {
    const selectedTrack = useStore(selectLastSelectedTrack);
    const tracks = useStore(selectTracks);

    return (
        <>
            {selectedTrack &&
                Array.from(selectedTrack.parts.entries()).map(
                    ([partId, part]) => (
                        <PianoRollPartView
                            key={partId}
                            part={part}
                            rowHeight={props.gridCellHeight}
                            cellWidth={props.columnWidth}
                            gridHeight={props.gridHeight}
                            pixelsPerSecond={GetPixelsPerSecond(
                                props.basePixelsPerSecond
                            )}
                            snapWidth={props.snapWidth}
                            isSnappingOn={props.isSnappingOn}
                        />
                    )
                )}
        </>
    );
};

export default GridView;

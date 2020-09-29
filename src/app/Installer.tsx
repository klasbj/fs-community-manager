import React, { useReducer } from "react";
import type { PreviewResult } from "../archiveManager";

interface State {
    files: PreviewResult[];
    waitingFor: number;
}

type Action =
    | {
          type: "add_preview";
          file: PreviewResult;
      }
    | {
          type: "loading";
          count: number;
      }
    | {
          type: "done_loading";
      }
    | { type: "reset" };

const reducer = (prev: State, action: Action): State => {
    switch (action.type) {
        case "loading":
            return { ...prev, waitingFor: action.count };
        case "done_loading":
            if (prev.waitingFor > 0) {
                return { ...prev, waitingFor: 0 };
            }
            return prev;
        case "add_preview":
            return { ...prev, files: [...prev.files, action.file], waitingFor: prev.waitingFor - 1 };
        case "reset":
            return { files: [], waitingFor: 0 };
    }
};

const PreviewDisplay: React.FC<{ preview: PreviewResult }> = ({ preview }) => {
    if (preview.result === "too_large") {
        return (
            <div>
                <span>{preview.path}</span>
                <span>File is too large to preview</span>
            </div>
        );
    }

    const packages = preview.packages.map((x) => (
        <div key={x.title + x.version}>
            <span>{preview.path}</span>
            <span>{x.title}</span>
            <span>{x.version}</span>
            <span>{x.content_type}</span>
        </div>
    ));

    return <>{packages}</>;
};

export const Installer: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, { files: [], waitingFor: 0 });

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files.length <= 0) {
            return;
        }

        dispatch({ type: "loading", count: e.target.files.length });
        const all = Array.from(e.target.files).map((f) =>
            window.archiveManager.preview(f).then((preview) => dispatch({ type: "add_preview", file: preview }))
        );

        Promise.all(all).finally(() => dispatch({ type: "done_loading" }));
    };

    const previews = state.files?.length > 0 ? state.files.map((x) => <PreviewDisplay preview={x} />) : null;

    const unpackClick = () => {
        if (state.waitingFor > 0) {
            return;
        }

        Promise.all(state.files.map(window.archiveManager.unpack))
            .catch((e) => console.error(e))
            .finally(() => dispatch({ type: "reset" }));
    };

    return (
        <div className="Installer">
            <label htmlFor="InstallBrowser">Install packages</label>
            <br />
            <input type="file" id="InstallBrowser" accept="application/zip" multiple onChange={onFileChange} />
            <br />
            {previews}
            {previews == null ? null : <button onClick={unpackClick}>Unpack</button>}
        </div>
    );
};

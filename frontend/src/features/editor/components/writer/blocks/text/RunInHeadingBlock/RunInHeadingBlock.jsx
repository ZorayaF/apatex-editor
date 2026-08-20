// src/features/editor/components/blocks/text/RunInHeadingBlock/RunInHeadingBlock.jsx
import React, { useRef, useEffect, useCallback } from "react";
import { useStore } from "@store";
import { DOCUMENT_THEME } from "@logic/rules/documentStyles";
import { useCaret } from "@hooks/useCaret";

export const RunInHeadingBlock = ({
  id,
  title = "",
  content = "",
  type = "h4",
  style,
  className,
}) => {
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  const { updateBlock, splitBlock, setSelectedBlockId, selectedBlockId } =
    useStore();
  const caretTitle = useCaret(titleRef);
  const caretContent = useCaret(contentRef);

  useEffect(() => {
    if (titleRef.current && titleRef.current.innerText !== title) {
      titleRef.current.innerText = title;
    }
    if (contentRef.current && contentRef.current.innerText !== content) {
      contentRef.current.innerText = content;
    }
  }, [title, content]);

  useEffect(() => {
    if (
      selectedBlockId === id &&
      document.activeElement !== titleRef.current &&
      document.activeElement !== contentRef.current
    ) {
      if (title.length > 0) {
        contentRef.current?.focus();
      } else {
        titleRef.current?.focus();
      }
    }
  }, [selectedBlockId, id, title.length]);

  const handleTitleInput = useCallback(() => {
    updateBlock(id, { title: titleRef.current?.innerText || "" });
  }, [id, updateBlock]);

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      contentRef.current?.focus();
      caretContent.setOffset(0);
    }
  };

  const handleContentInput = useCallback(() => {
    updateBlock(id, { content: contentRef.current?.innerText || "" });
  }, [id, updateBlock]);

  const handleContentKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const offset = caretContent.getOffset();
      const currentContent = contentRef.current?.innerText || "";

      const safeOffset = Math.max(0, Math.min(offset, currentContent.length));
      const textBefore = currentContent.slice(0, safeOffset);
      const textAfter = currentContent.slice(safeOffset);

      updateBlock(id, { content: textBefore });
      splitBlock(id, textBefore, textAfter);
    }

    if (e.key === "Backspace") {
      const offset = caretContent.getOffset();
      if (offset === 0) {
        e.preventDefault();
        titleRef.current?.focus();
        caretTitle.setAtEnd();
      }
    }
  };

  const handleFocus = () => {
    if (selectedBlockId !== id) setSelectedBlockId(id);
  };

  const isH5 = type === "h5";
  const blockStyle = DOCUMENT_THEME.blocks?.[type] || {};

  return (
    <div
      className={className}
      onClick={handleFocus}
      style={{
        ...DOCUMENT_THEME.global,
        ...blockStyle,
        ...style,
        outline: "none",
        whiteSpace: "pre-wrap",
      }}
    >
      <span
        ref={titleRef}
        data-role="title"
        contentEditable
        suppressContentEditableWarning
        onInput={handleTitleInput}
        onKeyDown={handleTitleKeyDown}
        onFocus={handleFocus}
        style={{
          fontWeight: "bold",
          fontStyle: isH5 ? "italic" : "normal",
          outline: "none",
          minWidth: "8px",
          display: "inline",
        }}
      />

      <span
        contentEditable={false}
        style={{
          userSelect: "none",
          fontWeight: "bold",
          fontStyle: isH5 ? "italic" : "normal",
        }}
      >
        .{" "}
      </span>

      <span
        ref={contentRef}
        data-role="content"
        contentEditable
        suppressContentEditableWarning
        onInput={handleContentInput}
        onKeyDown={handleContentKeyDown}
        onFocus={handleFocus}
        style={{
          outline: "none",
          minWidth: "8px",
          display: "inline",
        }}
      />
    </div>
  );
};

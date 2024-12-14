package services

import (
	"errors"
	"strings"
)

const (
	DoubleQuotePlaceholder = "[[DQ]]"
	ColonPlaceholder       = "[[COLON]]"
	CommaPlaceholder       = "[[COMMA]]"
)

func TransformPayload(payload string, mode string) (string, error) {
	switch mode {
	case "encode":
		return encodePayload(payload), nil
	case "decode":
		return decodePayload(payload), nil
	default:
		return "", errors.New("invalid mode: use 'encode' or 'decode'")
	}
}

func encodePayload(text string) string {
	text = strings.ReplaceAll(text, `"`, DoubleQuotePlaceholder)
	text = strings.ReplaceAll(text, ":", ColonPlaceholder)
	text = strings.ReplaceAll(text, ",", CommaPlaceholder)
	return text
}

func decodePayload(text string) string {
	text = strings.ReplaceAll(text, DoubleQuotePlaceholder, `"`)
	text = strings.ReplaceAll(text, ColonPlaceholder, ":")
	text = strings.ReplaceAll(text, CommaPlaceholder, ",")
	return text
}

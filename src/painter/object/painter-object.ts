import {
    TgdContext,
    TgdDataset,
    TgdMat4,
    TgdPainter,
    TgdParserGLTransfertFormatBinary,
    TgdProgram,
    TgdShaderFragment,
    TgdShaderVertex,
    TgdTexture2D,
    TgdVertexArray,
    webglElementTypeFromTypedArray,
} from "@tolokoban/tgd"

export interface PainterObjectOptions {
    textureImage: HTMLImageElement | HTMLCanvasElement
    glbContent: ArrayBuffer
    meshIndex?: number
    primitiveIndex?: number
}

/**
 * Paint a 3D object that has only POSITION and TEXCOORD_0 as attributes.
 * It will be rendered with a texture.
 */
export class PainterObject extends TgdPainter {
    private static readonly textureIds = new Map<
        HTMLImageElement | HTMLCanvasElement,
        string
    >()

    private static getTextureId(
        img: HTMLImageElement | HTMLCanvasElement
    ): string {
        if (PainterObject.textureIds.has(img)) {
            return PainterObject.textureIds.get(img) as string
        } else {
            const id = `PainterObject/${PainterObject.textureIds.size}`
            PainterObject.textureIds.set(img, id)
            return id
        }
    }

    public matrixTransfo = new TgdMat4()

    private readonly prg: TgdProgram
    private readonly vao: TgdVertexArray
    private readonly elementsType: number
    private readonly count: number
    private readonly texture: TgdTexture2D

    constructor(
        private readonly context: TgdContext,
        {
            glbContent,
            meshIndex = 0,
            primitiveIndex = 0,
            textureImage,
        }: PainterObjectOptions
    ) {
        super()
        this.texture = context.textures2D.create(
            {
                image: textureImage,
                wrapR: "CLAMP_TO_EDGE",
                wrapS: "CLAMP_TO_EDGE",
            },
            PainterObject.getTextureId(textureImage)
        )
        const vert = new TgdShaderVertex({
            uniforms: {
                uniTransfoMatrix: "mat4",
                uniModelViewMatrix: "mat4",
                uniProjectionMatrix: "mat4",
            },
            attributes: {
                attPos: "vec4",
                attUV: "vec2",
            },
            varying: { varUV: "vec2" },
            functions: {},
            mainCode: [
                "varUV = attUV;",
                "gl_Position = uniProjectionMatrix * uniModelViewMatrix * uniTransfoMatrix * attPos;",
            ],
        }).code
        const frag = new TgdShaderFragment({
            outputs: { FragColor: "vec4" },
            varying: { varUV: "vec2" },
            uniforms: { uniTexture: "sampler2D" },
            mainCode: ["FragColor = texture(uniTexture, varUV);"],
        }).code
        const prg = context.programs.create({
            vert,
            frag,
        })
        this.prg = prg
        const glb = new TgdParserGLTransfertFormatBinary(glbContent)
        const primitive = glb.getMeshPrimitive(meshIndex, primitiveIndex)
        const { POSITION, TEXCOORD_0 } = primitive.attributes
        const indices = primitive.indices ?? 2
        const dataset = new TgdDataset({
            attPos: "vec3",
            attUV: "vec2",
        })
        dataset.set("attPos", glb.getBufferViewData(POSITION))
        dataset.set("attUV", glb.getBufferViewData(TEXCOORD_0))
        const elements = glb.getBufferViewData(indices)
        this.elementsType = webglElementTypeFromTypedArray(elements)
        this.vao = context.createVAO(prg, [dataset], elements)
        this.count = elements.length
    }

    public readonly paint = () => {
        const { context, prg, count, matrixTransfo, texture } = this
        const { gl, camera } = context
        gl.enable(gl.CULL_FACE)
        gl.cullFace(gl.BACK)
        prg.use()
        prg.uniformMatrix4fv("uniTransfoMatrix", matrixTransfo)
        prg.uniformMatrix4fv("uniModelViewMatrix", camera.matrixModelView)
        prg.uniformMatrix4fv("uniProjectionMatrix", camera.matrixProjection)
        texture.activate(prg, "uniTexture")
        this.vao.bind()
        gl.drawElements(gl.TRIANGLES, count, this.elementsType, 0)
        this.vao.unbind()
    }

    delete(): void {
        this.vao.delete()
    }
}

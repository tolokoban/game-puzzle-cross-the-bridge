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

export interface PainterRiverOptions {
    textureImage: HTMLImageElement | HTMLCanvasElement
    glbContent: ArrayBuffer
    meshIndex?: number
    primitiveIndex?: number
}

/**
 * The river is semi-transparent, so it must be painted last.
 */
export class PainterRiver extends TgdPainter {
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
        }: PainterRiverOptions
    ) {
        super()
        this.texture = context.textures2D.create(
            {
                image: textureImage,
                wrapR: "REPEAT",
                wrapS: "REPEAT",
            },
            "PainterRiver"
        )
        const vert = new TgdShaderVertex({
            uniforms: {
                uniTime: "float",
                uniTransfoMatrix: "mat4",
                uniModelViewMatrix: "mat4",
                uniProjectionMatrix: "mat4",
            },
            attributes: {
                attPos: "vec4",
                attUV: "vec2",
            },
            varying: { varUV: "vec2", varSpec: "float" },
            functions: {},
            mainCode: [
                "varUV = attUV + vec2(0.0, uniTime);",
                "float x = attPos.x;",
                "float y = attPos.y;",
                "float z = attPos.z;",
                "float X = sin(uniTime * 3.0 + x * 1.0 + cos(z));",
                "float Z = sin(uniTime * 50.0 + z * 3.0);",
                "varSpec = ((X + Z) * 0.2) + 0.5;",
                "varSpec = pow(varSpec, 6.0);",
                "vec4 pos = vec4(",
                ["x,", ".1 * (X + Z) + y,", "z,", "1"],
                ");",
                "gl_Position = uniProjectionMatrix * uniModelViewMatrix * uniTransfoMatrix * pos;",
            ],
        }).code
        const frag = new TgdShaderFragment({
            outputs: { FragColor: "vec4" },
            varying: { varUV: "vec2", varSpec: "float" },
            uniforms: { uniTexture: "sampler2D" },
            mainCode: [
                "vec4 color = texture(uniTexture, varUV);",
                "FragColor = vec4(color.rgb + vec3(varSpec) , color.a);",
            ],
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

    public readonly paint = (time: number) => {
        const { context, prg, count, matrixTransfo, texture } = this
        const { gl, camera } = context
        gl.enable(gl.CULL_FACE)
        gl.cullFace(gl.BACK)
        prg.use()
        prg.uniform1f("uniTime", time * 0.001)
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
